import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "@/store/slices/ChatSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ban, Send } from "lucide-react";

function InputChat({ chatId, inputDisabled, onToggleInput }) {
  const [text, setText] = useState("");
  const dispatch = useDispatch();
  const { user , canSend } = useSelector((state) => state.user);
  const userName =
    [user?.firstName, user?.secondName].filter(Boolean).join(" ") || "User";
  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || !user) return;

    dispatch(
      sendMessage({
        chatId,
        message: trimmed,
        senderId: user.uid,
        senderName: userName,
        senderAvatarUrl: user.photoURL || null,
      }),
    );

    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-sky-100 bg-white p-3 sm:p-4">
      {!user && (
        <p className="mb-2 text-center text-xs text-slate-500">
          Sign in to join the conversation.
        </p>
      )}
      <div className="flex w-full items-center gap-2">
        <Input
          disabled={!user || inputDisabled || (!canSend)}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a message..."
          className="h-11 flex-1 rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-teal-500"
        />
        <Button
          onClick={handleSend}
          disabled={!text.trim()}
          className="h-11 rounded-xl bg-teal-700 px-4 text-white hover:bg-teal-800"
        >
          <Send className="h-4 w-4" />
          <span className="hidden sm:inline">Send</span>
        </Button>
        {user?.role === "admin" && (
          <Button
            type="button"
            variant="outline"
            onClick={onToggleInput}
            title={inputDisabled ? "Enable chat input" : "Disable chat input"}
            aria-label={inputDisabled ? "Enable chat input" : "Disable chat input"}
            className="h-11 w-11 shrink-0 border-slate-200 p-0 text-slate-600 hover:bg-amber-50 hover:text-amber-700"
          >
            <Ban className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default InputChat;