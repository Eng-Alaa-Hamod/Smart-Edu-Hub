import { useDispatch, useSelector } from "react-redux";
import { Ban, Flag, Trash2 } from "lucide-react";
import { Virtuoso } from "react-virtuoso";
import { SpinnerCustom } from "@/components/ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message";
import { deleteMessage } from "@/store/slices/ChatSlice";
import { reportUser } from "@/store/slices/userSlice";
import { changeUserCanSendMessageStatus } from "@/store/slices/adminSlice";
import { ConfirmDialog } from "@/components/multi use/ConfirmDialog";

function ChatMessages({
  chatId,
  currentUserId,
  fetchMoreMessages,
  hasMore,
  loadingMore,
}) {
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.chat);
  const { user , canSend } = useSelector((state) => state.user);
  const role = user?.role;

  if (loading && messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-sm text-slate-400">
        <SpinnerCustom className="text-teal-700" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center text-sm text-rose-500">
        {error}
      </div>
    );
  }

  if (!loading && messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="text-sm font-medium text-slate-600">No messages yet</p>
        <p className="mt-1 text-xs text-slate-400">
          Start the conversation now!
        </p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <Virtuoso
        data={messages}
        computeItemKey={(msg) => msg.id}
        initialTopMostItemIndex={messages.length - 1}
        followOutput="smooth"
        atBottomThreshold={96}
        className="h-full w-full"
        components={{
          Header: () => (
            <div className="flex justify-center py-3">
              {hasMore && (
                <button
                  type="button"
                  onClick={fetchMoreMessages}
                  disabled={loadingMore}
                  className="text-xs text-sky-600 hover:text-sky-800 disabled:opacity-50"
                >
                  {loadingMore ? (
                    <SpinnerCustom
                      className="text-sky-600"
                      aria-label="Loading older messages"
                    />
                  ) : (
                    "Load older messages"
                  )}
                </button>
              )}
            </div>
          ),
          Footer: () => <div className="h-5" />,
        }}
        itemContent={(index, msg) => {
          const isMe = msg.senderId === currentUserId;
          const senderName = msg.senderName || "User";
          const prevMsg = messages[index - 1];
          const isSameSender = prevMsg?.senderId === msg.senderId;
          const senderAvatarUrl =
            msg.senderAvatarUrl || (isMe ? user?.photoURL : null);

          const time = msg.timestamp
            ? new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : null;

          return (
            <div className="px-4 pb-3 sm:px-6" key={msg.id}>
              <Message
                align={isMe ? "end" : "start"}
                className={`gap-2 ${isSameSender ? "mt-[-6px]" : "mt-2"}`}
              >
                <MessageAvatar
                  aria-hidden={isSameSender}
                  className={
                    isSameSender
                      ? "h-7 w-7 min-w-[28px] invisible"
                      : "h-7 w-7 min-w-[28px]"
                  }
                >
                  <Avatar className="h-full w-full object-cover">
                    <AvatarImage
                      src={senderAvatarUrl || undefined}
                      alt={senderName}
                      className="h-full w-full object-cover"
                    />
                    <AvatarFallback className="bg-teal-100 text-[10px] font-bold text-teal-800">
                      {senderName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </MessageAvatar>
                <MessageContent className="max-w-[80%] sm:max-w-[70%]">
                  {!isSameSender && (
                    <div
                      className={`mb-1 flex items-center gap-1.5 text-[11px] ${
                        isMe ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span className="font-semibold text-slate-700">
                        {senderName}
                      </span>
                      <span className="text-[10px] text-slate-400">{time}</span>
                    </div>
                  )}
                  <div
                    className={`flex items-end gap-2 ${
                      isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    {(role === "admin" || role === "teacher" || isMe) && (
                      <ConfirmDialog
                        trigger={<button type="button" aria-label="Delete message" title="Delete message" className="mb-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500"><Trash2 className="h-3 w-3" /></button>}
                        title="Delete this message?"
                        description="This message will be permanently removed from the conversation."
                        confirmText="Delete"
                        cancelText="Cancel"
                        confirmVariant="destructive"
                        onConfirm={() => dispatch(deleteMessage({ chatId, messageId: msg.id }))}
                      />
                    )}

                    <Bubble
                      variant={isMe ? "default" : "muted"}
                      align={isMe ? "end" : "start"}
                    >
                      <BubbleContent
                        className={`px-3.5 py-2 text-sm leading-relaxed ${
                          isMe
                            ? "rounded-2xl rounded-br-xs bg-teal-700 text-white"
                            : "rounded-2xl rounded-bl-xs border border-slate-100 bg-white text-slate-800 shadow-xs"
                        }`}
                      >
                        {msg.text}
                      </BubbleContent>
                    </Bubble>

                    {!isMe && canSend &&(
                      <>
                      <button
                        type="button"
                        aria-label="Report user"
                        title="Report user"
                        onClick={() => dispatch(reportUser(msg.senderId))}
                        className="mb-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600"
                      >
                        <Flag className="h-3 w-3" />
                      </button>
                      
                      {role === "admin" && (
                        <button
                          type="button"
                          aria-label="Block user from sending messages"
                          title="Block user from sending messages"
                          onClick={() => dispatch(changeUserCanSendMessageStatus(msg.senderId))}
                          className="mb-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Ban className="h-3 w-3" />
                        </button>
                      )}
                      </>
                    )}
                  </div>
                </MessageContent>
              </Message>
            </div>
          );
        }}
      />
    </div>
  );
}

export default ChatMessages;
