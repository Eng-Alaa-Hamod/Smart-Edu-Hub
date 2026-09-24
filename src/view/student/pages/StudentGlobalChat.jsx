import Chat from "../../../components/chat/Chat";
import { useChatListener } from "@/hooks/useChatListener";
import { useSelector } from "react-redux";

function StudentGlobalChat() {
  const user = useSelector((state) => state.user.user);
  const activeChatId = "global";

  useChatListener(activeChatId);

  return (
    <div>
      <Chat currentUserId={user?.uid} />
    </div>
  );
}

export default StudentGlobalChat;