import { useChatListener } from "@/hooks/useChatListener";
import { MessageCircle } from "lucide-react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchChatData, toggleChatInput } from "@/store/slices/ChatSlice";
import ChatMessages from "./ChatMessages";
import InputChat from "./InputChat";

function Chat({ chatId, title = "Global conversation", subtitle = "Share, ask, and learn together" }) {
  const user = useSelector((state) => state.user.user);
  const chatData = useSelector((state) => state.chat.chatData);
  const dispatch = useDispatch();
  const activeChatId = chatId || "global";

  useEffect(() => {
    dispatch(fetchChatData(activeChatId));
  }, [activeChatId, dispatch]);

  const { fetchMoreMessages, hasMore, loadingMore } =
    useChatListener(activeChatId);

  return (
    <section className="m-2 flex h-[min(42rem,calc(100vh-7rem))] min-h-[24rem] w-[calc(100%-1rem)] flex-1 flex-col overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-xl shadow-sky-100/50 sm:m-3 sm:min-h-[32rem] sm:w-[calc(100%-1.5rem)] sm:rounded-3xl">
      <header className="sticky top-0 z-10 flex shrink-0 items-center gap-3 border-b border-sky-100 bg-gradient-to-r from-sky-50 via-white to-emerald-50 px-3 py-3 sm:px-5 sm:py-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 text-white shadow-md shadow-sky-200">
          <MessageCircle className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-semibold text-slate-800">{title}</h2>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
      </header>
      <div className="min-h-0 flex-1 overflow-hidden bg-slate-50/40">
        <ChatMessages
          chatId={activeChatId}
          currentUserId={user?.uid}
          fetchMoreMessages={fetchMoreMessages}
          hasMore={hasMore}
          loadingMore={loadingMore}
        />
      </div>
      <InputChat
        chatId={activeChatId}
        inputDisabled={chatData?.inputDisabled}
        onToggleInput={() => dispatch(toggleChatInput(activeChatId))}
      />
    </section>
  );
}

export default Chat;