import { useDispatch, useSelector } from "react-redux";
import { startQuestion } from "@/store/slices/GameSlice";
import { SpinnerCustom } from "@/components/ui/spinner";

export default function TeacherLobby() {
  const dispatch = useDispatch();
  const { pin, room, loading } = useSelector((s) => s.game);
  const players = Object.values(room.players || {});

  return (
    <div className="mx-auto mt-3 w-full max-w-5xl space-y-5 rounded-3xl border border-sky-100 bg-white p-5 shadow-xl shadow-sky-100/60 sm:p-8">
      <div className="rounded-2xl bg-gradient-to-r from-sky-500 to-teal-500 p-6 text-white">
        <p className="text-sm font-medium text-sky-100">Live quiz room</p>
        <h2 className="mt-2 text-3xl font-bold tracking-wide">{pin}</h2>
        <p className="mt-2 text-sm text-white/85">Share this PIN with your students.</p>
      </div>
      <div className="flex items-center justify-between rounded-2xl border border-sky-100 bg-sky-50/50 p-4">
        <span className="text-sm font-medium text-slate-600">Questions</span>
        <span className="text-xl font-bold text-teal-800">{room.totalQuestions}</span>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {players.map((p, i) => (
          <li key={i} className="rounded-xl border border-sky-100 bg-white p-3 font-medium text-slate-700 shadow-sm">{p.name}</li>
        ))}
      </ul>
      <button
        disabled={players.length === 0 || loading}
        onClick={() => dispatch(startQuestion({ pin, index: 0 }))}
        className="w-full rounded-xl bg-sky-600 px-5 py-3 font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading && <SpinnerCustom />}
        Start Question 1
      </button>
    </div>
  );
}