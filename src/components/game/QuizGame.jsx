import { useDispatch, useSelector } from "react-redux";
import { useGameListener } from "@/hooks/useGameListener";
import { clearGame, showLeaderboard } from "@/store/slices/GameSlice";
import TeacherLobby from "./views/TeacherLobby";
import StudentLobby from "./views/StudentLobby";
import TeacherQuestion from "./views/TeacherQuestion";
import StudentQuestion from "./views/StudentQuestion";
import TeacherReveal from "./views/TeacherReveal";
import StudentReveal from "./views/StudentReveal";
import TeacherLeaderboard from "./views/TeacherLeaderboard";
import StudentLeaderboard from "./views/StudentLeaderboard";
import TeacherEnd from "./views/TeacherEnd";
import StudentEnd from "./views/StudentEnd";

export default function App() {
  const dispatch = useDispatch();
  const { pin, room, roomDeleted, error, loading } = useSelector((s) => s.game);
  const role = useSelector((s) => s.user.user?.role);
  useGameListener(pin);

  if (!pin) return <p className="rounded-2xl border border-sky-100 bg-white p-8 text-center text-slate-500 shadow-sm">No active room.</p>;
  
  if (roomDeleted) {
    return (
      <div className="mx-auto mt-3 max-w-2xl rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-xl shadow-emerald-100/50">
        <p className="text-2xl font-bold text-teal-800">Thank you for participating in the game</p>
        <p className="mt-2 text-sm text-slate-500">The room has been closed.</p>
        <button
          type="button"
          onClick={() => dispatch(clearGame())}
          className="mt-6 w-full rounded-xl bg-sky-600 px-5 py-3 font-semibold text-white transition hover:bg-sky-700"
        >
          Back to Home
        </button>
      </div>
    );
  }
  
  if (error) {
    const canContinue = role === "teacher" && room?.status === "reveal";

    return (
      <div className="mx-auto mt-3 max-w-2xl rounded-2xl border border-rose-200 bg-rose-50 p-5 text-center shadow-sm">
        <p className="font-semibold text-rose-700">Unable to complete the action</p>
        <p className="mt-2 text-sm text-rose-600">{error}</p>
        {canContinue && (
          <button
            type="button"
            disabled={loading}
            onClick={() => dispatch(showLeaderboard({ pin }))}
            className="mt-4 w-full rounded-xl bg-sky-600 px-5 py-3 font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Continue playing
          </button>
        )}
      </div>
    );
  }
  if (!room) return <p className="rounded-2xl border border-sky-100 bg-white p-8 text-center text-slate-500 shadow-sm">Loading room...</p>;

  const isTeacher = role === "teacher";
  const status = room.status;

  switch (status) {
    case "lobby":
      return isTeacher ? <div className="px-3"><TeacherLobby /> </div> : <div className="px-3"><StudentLobby /> </div>;
    case "question":
      return isTeacher ? <div className="px-3"><TeacherQuestion /> </div> : <div className="px-3"><StudentQuestion /> </div>;
    case "reveal":
      return isTeacher ? <div className="px-3"><TeacherReveal /> </div> : <div className="px-3"><StudentReveal /> </div>;
    case "leaderboard":
      return isTeacher ? <div className="px-3"><TeacherLeaderboard /> </div> : <div className="px-3"><StudentLeaderboard /> </div>;
    case "end":
      return isTeacher ? <div className="px-3"><TeacherEnd /> </div> : <div className="px-3"><StudentEnd /> </div>;
    default:
      return <p>Unknown status: {status}</p>;
  }
}

