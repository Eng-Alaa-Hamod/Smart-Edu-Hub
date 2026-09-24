import { useDispatch, useSelector } from "react-redux";
import { startQuestion, endGame } from "@/store/slices/GameSlice";
import AutoAdvance from "@/components/game/components/AutoAdvance";
import { SpinnerCustom } from "@/components/ui/spinner";

export default function TeacherLeaderboard() {
  const dispatch = useDispatch();
  const { pin, room, loading } = useSelector((s) => s.game);

  const sorted = Object.entries(room.players || {})
    .map(([uid, p]) => ({ uid, ...p }))
    .sort((a, b) => b.score - a.score);

  const nextIndex = room.currentQuestionIndex + 1;
  const isLast = nextIndex >= room.totalQuestions;
  
  const question = room.questions[room.currentQuestionIndex];
  const autoAdvanceTime = question.timeLimit + 3;
  const advance = () => {
    if (isLast) {
      dispatch(endGame({ pin }));
    } else {
      dispatch(startQuestion({ pin, index: nextIndex }));
    }
  };

  return (
    <div className="mx-auto mt-3 w-full max-w-5xl space-y-5 rounded-3xl border border-sky-100 bg-white p-5 shadow-xl shadow-sky-100/60 sm:p-8">
      <div>
        <p className="text-sm font-semibold text-sky-600">Live results</p>
        <h2 className="mt-1 text-3xl font-bold text-teal-800">Leaderboard</h2>
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold text-emerald-600">Correct answer</p>
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 font-semibold text-emerald-700">
          {question.options[room.correctAnswerIndex]}
        </p>
      </div>
      <ol className="space-y-3">
        {sorted.map((p) => (
          <li key={p.uid} className="flex items-center justify-between rounded-xl border border-sky-100 bg-sky-50/40 p-4">
            <span className="font-semibold text-slate-700">{p.name}</span>
            <span className="font-bold text-teal-700">{p.score} <span className="text-xs font-medium text-emerald-600">(+{p.lastGain})</span></span>
          </li>
        ))}
      </ol>
      <AutoAdvance time={autoAdvanceTime} onComplete={advance} />
      {isLast ? (
        <button disabled={loading} onClick={() => dispatch(endGame({ pin }))} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60">
          {loading && <SpinnerCustom />}
          End Game
        </button>
      ) : (
        <button
          disabled={loading}
          onClick={() => dispatch(startQuestion({ pin, index: nextIndex }))}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <SpinnerCustom />}
          Next Question
        </button>
      )}
    </div>
  );
}