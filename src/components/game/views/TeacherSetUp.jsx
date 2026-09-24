import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteQuestion, fetchAllQuestions } from "@/store/slices/QuizSlice";
import { hostRoom } from "@/store/slices/GameSlice";
import { SpinnerCustom } from "@/components/ui/spinner";
import { ConfirmDialog } from "@/components/multi use/ConfirmDialog";

export default function TeacherSetup({ teacherId, quizName }) {
  const dispatch = useDispatch();
  const { questions, loading, error } = useSelector((s) => s.quiz);
  const quizLoading = useSelector((s) => s.quiz.loading);
  const gameLoading = useSelector((s) => s.game.loading);

  useEffect(() => {
    if (teacherId && quizName) {
      dispatch(fetchAllQuestions({ teacherId, quizName }));
    }
  }, [teacherId, quizName, dispatch]);

  const start = () => {
    dispatch(hostRoom({ questions: [...questions] }));
  };

  const handleDelete = (questionId) => {
    dispatch(deleteQuestion({ teacherId, quizName, questionId }));
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-sky-600">Question bank</p>
        <h2 className="mt-1 text-2xl font-bold text-teal-800">{quizName}</h2>
        <p className="mt-1 text-sm text-slate-500">All questions below will be included in your live game.</p>
      </div>
      {loading && <p className="rounded-xl bg-sky-50 p-4 text-sm text-sky-700"><SpinnerCustom className="text-red-600" /></p>}
      {error && <p className="rounded-xl bg-rose-50 p-4 text-sm text-rose-600">{error}</p>}
      <ul className="grid gap-3">
        {questions.map((q) => (
          <li key={q.id} className="flex items-center justify-between gap-4 rounded-2xl border border-sky-100 bg-sky-50/40 p-4 transition hover:border-sky-200 hover:bg-sky-50">
            <span>{q.question}</span>
            <ConfirmDialog
              trigger={<button type="button" disabled={loading} className="shrink-0 rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50">Delete</button>}
              title="Delete this question?"
              description="This question will be removed from the question bank."
              confirmText="Delete"
              cancelText="Cancel"
              confirmVariant="destructive"
              onConfirm={() => handleDelete(q.id)}
            />
          </li>
        ))}
      </ul>
      <button
        disabled={quizLoading || gameLoading || questions.length === 0}
        onClick={start}
        className="inline-flex items-center rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 px-5 py-3 font-semibold text-white shadow-md transition hover:from-sky-600 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {quizLoading || gameLoading ? (
          <SpinnerCustom />
        ) : (
          `Host Room (${questions.length} questions)`
        )}
      </button>
    </div>
  );
}
