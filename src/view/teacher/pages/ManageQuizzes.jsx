import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  Plus,
  Sparkles,
} from "lucide-react";
import { addQuestion, fetchQuizNames } from "@/store/slices/QuizSlice";
import QuizGame from "@/components/game/QuizGame";
import TeacherSetup from "@/components/game/views/TeacherSetUp";
import { SpinnerCustom } from "@/components/ui/spinner";
import { ConfirmDialog } from "@/components/multi use/ConfirmDialog";

function ManageQuizzes() {
  const dispatch = useDispatch();
  const pin = useSelector((state) => state.game.pin);

  const user = useSelector((state) => state.user.user);

  const { quizNames, loading, error } = useSelector((state) => state.quiz);

  const [quizName, setQuizName] = useState("");
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [activeQuizName, setActiveQuizName] = useState(null);

  const [formData, setFormData] = useState({
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "0",
    timeLimit: "30",
  });

  useEffect(() => {
    if (user?.uid) dispatch(fetchQuizNames(user.uid));
  }, [dispatch, user?.uid]);

  /* *** */
  if (pin) return <QuizGame />;
  /* *** */

  const handleQuizSubmit = (event) => {
    event.preventDefault();
    const cleanName = quizName.trim();
    if (!cleanName) return;
    setActiveQuizName(cleanName);
    setQuizName("");
  };

  const handleChange = ({ target }) => {
    setFormData((current) => ({ ...current, [target.name]: target.value }));
  };

  const handleQuestionSubmit = async (event) => {
    event.preventDefault();
    await dispatch(
      addQuestion({
        teacherId: user.uid,
        quizName: activeQuizName,
        question: formData.question.trim(),
        options: [
          formData.optionA.trim(),
          formData.optionB.trim(),
          formData.optionC.trim(),
          formData.optionD.trim(),
        ],
        correctAnswer: Number(formData.correctAnswer),
        timeLimit: Number(formData.timeLimit),
      }),
    ).unwrap();

    setFormData({
      question: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "0",
      timeLimit: "30",
    });
    setShowQuestionForm(false);
    dispatch(fetchQuizNames(user.uid));
  };

  if (!activeQuizName) {
    return (
      <main className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-sky-50 via-white to-emerald-50/70">
        <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
          <section className="flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 p-6 text-white shadow-xl shadow-sky-100 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-medium text-sky-100">
                <Sparkles className="h-4 w-4" />
                Teacher Workspace
              </p>
              <h1 className="text-2xl font-bold sm:text-4xl">My Quizzes</h1>
              <p className="mt-2 text-sm text-white/85 sm:text-base">
                Build question groups and prepare your next live game.
              </p>
            </div>
            <form
              onSubmit={handleQuizSubmit}
              className="flex w-full max-w-md flex-col gap-2 sm:flex-row"
            >
              <input
                value={quizName}
                onChange={(event) => setQuizName(event.target.value)}
                placeholder="New quiz name"
                aria-label="New quiz name"
                className="min-w-0 flex-1 rounded-xl border border-white/30 bg-white/95 px-4 py-3 text-slate-700 outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-white/30"
                required
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold text-teal-700 shadow-md transition hover:bg-sky-50 focus:outline-none focus:ring-4 focus:ring-white/40"
              >
                <Plus className="h-5 w-5" />
                Add group
              </button>
            </form>
          </section>

          {error && (
            <p className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-600">
              {error}
            </p>
          )}

          {loading && quizNames.length === 0 ? (
            <div className="rounded-2xl border border-sky-100 bg-white p-8 text-center text-teal-500 shadow-sm">
              <SpinnerCustom  />
            </div>
          ) : quizNames.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {quizNames.map((quiz) => (
                <button
                  key={quiz.id}
                  type="button"
                  onClick={() => setActiveQuizName(quiz.name)}
                  className="group flex min-h-48 flex-col justify-between rounded-3xl border border-sky-100 bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-emerald-100 text-teal-700 transition group-hover:from-sky-500 group-hover:to-teal-500 group-hover:text-white">
                    <BookOpenCheck className="h-6 w-6" />
                  </span>
                  <span>
                    <span className="mt-6 block line-clamp-2 text-xl font-bold text-teal-800">
                      {quiz.name}
                    </span>
                    <span className="mt-2 block text-sm text-slate-500">
                      Open question group
                    </span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-sky-200 bg-white p-10 text-center shadow-sm">
              <BookOpenCheck className="mx-auto h-12 w-12 text-sky-300" />
              <h2 className="mt-4 text-xl font-bold text-teal-800">
                No quizzes yet
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Create your first question group to start building a live quiz.
              </p>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-sky-50 via-white to-emerald-50/70">
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() => setActiveQuizName(null)}
              className="mb-4 text-sm font-semibold text-sky-700 transition hover:text-teal-700"
            >
              Back to quiz groups
            </button>
            <p className="flex items-center gap-2 text-sm font-medium text-sky-600">
              <BookOpenCheck className="h-4 w-4" />
              Question Group
            </p>
            <h1 className="mt-2 text-3xl font-bold text-teal-800">
              {activeQuizName}
            </h1>
          </div>
          {!showQuestionForm && (
            <button
              type="button"
              onClick={() => setShowQuestionForm(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 px-4 py-3 font-semibold text-white shadow-md transition hover:from-sky-600 hover:to-teal-600 focus:outline-none focus:ring-4 focus:ring-sky-100"
            >
              <Plus className="h-5 w-5" />
              Add question
            </button>
          )}
          
        </div>

        {showQuestionForm && (
          <form
            onSubmit={handleQuestionSubmit}
            className="rounded-3xl border border-sky-100 bg-white p-5 shadow-xl shadow-sky-100/60 sm:p-8"
          >
            <div className="mb-6">
              <p className="flex items-center gap-2 text-sm font-medium text-sky-600">
                <Plus className="h-4 w-4" />
                New Question
              </p>
              <h2 className="mt-2 text-2xl font-bold text-teal-800">
                Add a question
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700 md:col-span-2">
                Question
                <input
                  name="question"
                  value={formData.question}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-sky-100 px-4 py-3 text-slate-700 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  required
                />
              </label>
              {["A", "B", "C", "D"].map((option) => (
                <label
                  key={option}
                  className="block text-sm font-medium text-slate-700"
                >
                  Option {option}
                  <input
                    name={`option${option}`}
                    value={formData[`option${option}`]}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-sky-100 px-4 py-3 text-slate-700 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                    required
                  />
                </label>
              ))}
              <label className="block text-sm font-medium text-slate-700">
                Correct option
                <select
                  name="correctAnswer"
                  value={formData.correctAnswer}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-sky-100 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                >
                  <option value="0">Option A</option>
                  <option value="1">Option B</option>
                  <option value="2">Option C</option>
                  <option value="3">Option D</option>
                </select>
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Time limit in seconds
                <span className="relative mt-2 block">
                  <Clock3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-500" />
                  <input
                    name="timeLimit"
                    type="number"
                    min="1"
                    value={formData.timeLimit}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-sky-100 px-10 py-3 text-slate-700 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                    required
                  />
                </span>
              </label>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <ConfirmDialog
                trigger={<button type="button" className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 font-semibold text-white transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-100"><CheckCircle2 className="h-5 w-5" />Save question</button>}
                title="Save this question?"
                description="The question will be added to this quiz group."
                confirmText="Save question"
                cancelText="Cancel"
                confirmClassName="bg-teal-700 text-white hover:bg-teal-800"
                onConfirm={() => handleQuestionSubmit({ preventDefault() {} })}
              />
              <button
                type="button"
                onClick={() => setShowQuestionForm(false)}
                className="rounded-xl border border-sky-200 bg-white px-5 py-3 font-semibold text-sky-700 transition hover:bg-sky-50 focus:outline-none focus:ring-4 focus:ring-sky-100"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <section className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm sm:p-8">
          <TeacherSetup teacherId={user.uid} quizName={activeQuizName} />
        </section>
      </div>
    </main>
  );
}

export default ManageQuizzes;
