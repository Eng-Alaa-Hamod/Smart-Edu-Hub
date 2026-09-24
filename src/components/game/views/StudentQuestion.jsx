import { CountDownQuestionTime } from "@/components/game/components/CountDownQuestionTime";
import { useDispatch, useSelector } from "react-redux";
import { submitAnswer } from "@/store/slices/GameSlice";
import { SpinnerCustom } from "@/components/ui/spinner";

export default function PlayerQuestion() {
  const dispatch = useDispatch();
  const { pin, uid, room, loading } = useSelector((s) => s.game);

  const index = room.currentQuestionIndex;
  const question = room.questions[index];
  const already = room.answers?.[index]?.[uid];

  const handleAnswer = (choice) => {
    dispatch(submitAnswer({ pin, index, uid, choice }));
  };

  return (
    <div className="mx-auto mt-3 w-full max-w-5xl space-y-5 rounded-3xl border border-sky-100 bg-white p-5 shadow-xl shadow-sky-100/60 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-sky-600">Your question</p>
        <span className="rounded-full bg-sky-50 px-3 py-1 text-sm font-semibold text-teal-700">
          {index + 1} / {room.totalQuestions}
        </span>
      </div>
      <h2 className="text-2xl font-bold text-teal-800">
        Question {index + 1} / {room.totalQuestions}
      </h2>
      <CountDownQuestionTime question={question} />
      <h3 className="rounded-2xl bg-sky-50 p-5 text-lg font-semibold leading-7 text-slate-700">
        {question.question}
      </h3>
      <ul className="grid gap-3 sm:grid-cols-2">
        {question.options.map((opt, i) => (
          <li key={i}>
            <button
              disabled={!!already || loading}
              onClick={() => handleAnswer(i)}
              className="w-full rounded-xl border border-sky-100 bg-white p-4 text-left font-medium text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && <SpinnerCustom className="mr-2 inline-flex" />}
              {opt}
            </button>
          </li>
        ))}
      </ul>
      {already && (
        <p className="rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
          Answer submitted. Waiting...
        </p>
      )}
    </div>
  );
}
