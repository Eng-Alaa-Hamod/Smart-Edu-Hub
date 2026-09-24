import { useDispatch, useSelector } from "react-redux";
import { revealAnswer } from "@/store/slices/GameSlice";
import AutoAdvance from "@/components/game/components/AutoAdvance";
import { SpinnerCustom } from "@/components/ui/spinner";

export default function TeacherQuestion() {
  const dispatch = useDispatch();
  const { pin, room, loading } = useSelector((s) => s.game);
  const index = room.currentQuestionIndex;
  const question = room.questions[index];
  
  const players = Object.keys(room.players || {});
  const answered = Object.keys(room.answers?.[index] || {});
  const autoRevealTime = question.timeLimit + 3;

  return (
    <div className="mx-auto mt-3 w-full max-w-5xl space-y-5 rounded-3xl border border-sky-100 bg-white p-5 shadow-xl shadow-sky-100/60 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-sky-600">Live question</p>
        <span className="rounded-full bg-sky-50 px-3 py-1 text-sm font-semibold text-teal-700">
          {index + 1} / {room.totalQuestions}
        </span>
      </div>
      <h2 className="text-2xl font-bold text-teal-800">
        Question {index + 1} / {room.totalQuestions}
      </h2>
      <h3 className="rounded-2xl bg-sky-50 p-5 text-lg font-semibold leading-7 text-slate-700">{question.question}</h3>
      <ul className="grid gap-3 sm:grid-cols-2">
        {question.options.map((opt, i) => (
          <li key={i} className="rounded-xl border border-sky-100 p-4 font-medium text-slate-700">{opt}</li>
        ))}
      </ul>
      <p className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
        Answered: {answered.length} / {players.length}
      </p>
      <AutoAdvance
        time={autoRevealTime}
        onComplete={() => dispatch(revealAnswer({ pin }))}
      />
      <button disabled={loading} onClick={() => dispatch(revealAnswer({ pin }))} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60">
        {loading && <SpinnerCustom />}
        Reveal Answer
      </button>
    </div>
  );
}