import { useDispatch, useSelector } from "react-redux";
import { showLeaderboard } from "@/store/slices/GameSlice";
import AutoAdvance from "@/components/game/components/AutoAdvance";
import { SpinnerCustom } from "@/components/ui/spinner";

export default function TeacherReveal() {
  const dispatch = useDispatch();
  const { pin, room, loading } = useSelector((s) => s.game);
  
  const index = room.currentQuestionIndex;
  const question = room.questions[index];
  const correct = room.correctAnswerIndex;
  const autoAdvanceTime = question.timeLimit + 3;

  return (
    <div className="mx-auto mt-3 w-full max-w-5xl space-y-5 rounded-3xl border border-sky-100 bg-white p-5 shadow-xl shadow-sky-100/60 sm:p-8">
      <div>
        <p className="text-sm font-semibold text-emerald-600">Answer revealed</p>
        <h3 className="mt-2 rounded-2xl bg-sky-50 p-5 text-lg font-semibold leading-7 text-slate-700">{question.question}</h3>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {question.options.map((opt, i) => (
          <li key={i} className={`rounded-xl border p-4 font-medium ${i === correct ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-sky-100 text-slate-700"}`}>
            {opt} {i === correct ? "(Correct)" : ""}
          </li>
        ))}
      </ul>
      <AutoAdvance
        time={autoAdvanceTime}
        onComplete={() => dispatch(showLeaderboard({ pin }))}
      />
      <button disabled={loading} onClick={() => dispatch(showLeaderboard({ pin }))} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60">
        {loading && <SpinnerCustom />}
        Show Leaderboard
      </button>
    </div>
  );
}