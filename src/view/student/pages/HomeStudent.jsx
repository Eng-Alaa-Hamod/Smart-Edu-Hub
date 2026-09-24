import { useDispatch, useSelector } from "react-redux";
import {
  Award,
  BookOpen,
  CheckCircle2,
  FileText,
  Gamepad2,
  Gauge,
  Star,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { calcRateAchievement } from "@/store/slices/PLayerSaveAchivementSlice";
import { fetchLibraryPdfs } from "@/store/slices/LibraryPdfsFromStudentSlice";

function HomeStudent() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const achievement = useSelector(
    (state) => state.playerAchievements.lastSaved,
  );
  const { enrolledCourses } = useSelector((state) => state.courseStudent ?? {});
  const libraryLessons = useSelector((state) => state.library?.lessons || []);
  
  const totalMedals = useMemo(
    () => {
      const badges = achievement?.badges || {};
      return (badges.gold || 0) + (badges.silver || 0) + (badges.bronze || 0);
    },
    [achievement],
  );
  
  const badges = achievement?.badges || {};
  const rate = Number(achievement?.rate) || 0;
  const totalQuestions = achievement?.totalQuestions || 0;
  const correctAnswers = achievement?.totalCorrectAnswers || 0;
  const wrongAnswers = achievement?.totalWrongAnswers || 0;

  const correctRate = totalQuestions
    ? (correctAnswers / totalQuestions) * 100
    : 0;
  const wrongRate = totalQuestions
    ? (wrongAnswers / totalQuestions) * 100
    : 0;

  const publishedPdfs = libraryLessons.filter(
    (lesson) => lesson.userId === user?.uid,
  ).length;

  const rateStatus = rate < 50
    ? { label: "Bad", color: "bg-red-100 text-red-700" }
    : rate < 75
      ? { label: "Average", color: "bg-yellow-100 text-yellow-700" }
      : { label: "Excellent", color: "bg-emerald-100 text-emerald-700" };

  useEffect(() => {
    if (user?.uid) {
      dispatch(calcRateAchievement({ uid: user.uid }));
      dispatch(fetchLibraryPdfs());
    }
  }, [dispatch, user?.uid]);

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-sky-50 via-white to-emerald-50/70">
      <div className="mx-auto max-w-7xl space-y-5 p-3 sm:space-y-6 sm:p-6 lg:p-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 p-6 text-white shadow-xl shadow-sky-100 sm:p-8">
          <div className="max-w-2xl">
            <p className="mb-2 text-sm font-medium text-sky-100">
              Your learning space
            </p>
            <h1 className="text-2xl font-bold sm:text-4xl">
              Welcome, {user?.firstName}.
            </h1>
            <p className="mt-3 text-sm text-white/85 sm:text-base">
              Let's continue learning and reach your next goal.
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-teal-800 sm:text-2xl">
          General information
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Enroll courses",
              value: enrolledCourses.length,
              detail: "Active courses",
              icon: BookOpen,
              color: "bg-sky-100 text-sky-700",
            },
            {
              label: "Published PDFs",
              value: publishedPdfs,
              detail: "Your shared files",
              icon: FileText,
              color: "bg-emerald-100 text-emerald-700",
            },
            {
              label: "Rating",
              value: `${achievement?.rate || 0}%`,
              detail: "Your average rating",
              icon: Gauge,
              color: "bg-cyan-100 text-cyan-700",
            },
            {
              label: "Total Quiz",
              value: achievement?.gamesPlayed || 0,
              detail: "Games played",
              icon: Gamepad2,
              color: "bg-lime-100 text-lime-700",
            },
          ].map(({ label, value, detail, icon: Icon, color }) => (
            <div
              key={label}
              className="rounded-2xl border border-sky-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-5"
            >
              <div
                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${color}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-sm text-slate-500">{label}</p>
              <div className="mt-1 flex items-end justify-between gap-2">
                <p className="text-2xl font-bold text-slate-800">{value}</p>
                <p className="text-xs text-slate-400">{detail}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-teal-800 sm:text-2xl">
          Game Quiz Achievement
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Medals",
              value: totalMedals,
              detail: `${badges.gold || 0} gold · ${badges.silver || 0} silver · ${badges.bronze || 0} bronze`,
              icon: Award,
              color: "bg-amber-100 text-amber-700",
            },
            {
              label: "Correct questions",
              value: achievement?.totalCorrectAnswers || 0,
              detail: "Right answers",
              icon: CheckCircle2,
              color: "bg-emerald-100 text-emerald-700",
            },
            {
              label: "Wrong questions",
              value: achievement?.totalWrongAnswers || 0,
              detail: "Answers to review",
              icon: XCircle,
              color: "bg-rose-100 text-rose-700",
            },
            {
              label: "Total points",
              value: achievement?.totalScore || 0,
              detail: "All game points",
              icon: Star,
              color: "bg-sky-100 text-sky-700",
            },
          ].map(({ label, value, detail, icon: Icon, color }) => (
            <div
              key={label}
              className="rounded-2xl border border-sky-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-5"
            >
              <div
                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${color}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-sm text-slate-500">{label}</p>
              <div className="mt-1 flex items-end justify-between gap-2">
                <p className="text-2xl font-bold text-slate-800">{value}</p>
                <p className="text-xs text-slate-400">{detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,1fr)]">
          <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-teal-800">
                  Your rating 
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Your current learning progress toward the 100% goal.
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${rateStatus.color}`}>
                {rateStatus.label} {rate}%
              </span>
            </div>
            <div className="mt-6 h-3 overflow-hidden rounded-full bg-sky-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-[width] duration-500"
                style={{ width: `${rate}%` }}
              />
            </div>
            <div className="mt-3 flex justify-between text-sm text-slate-500">
              <span>{rate}% completed</span>
              <span>Go to {100 - rate}%</span>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-xl font-bold text-teal-800">Question performance</h3>
            <p className="mt-1 text-sm text-slate-500">
              Your results from all completed quizzes.
            </p>
            <div className="mt-5 space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-600">Correct answers</span>
                  <span className="font-semibold text-emerald-600">
                    {correctRate}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-emerald-100">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-[width] duration-500"
                    style={{ width: `${correctRate}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-600">Wrong answers</span>
                  <span className="font-semibold text-rose-600">
                    {wrongRate}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-rose-100">
                  <div
                    className="h-full rounded-full bg-rose-500 transition-[width] duration-500"
                    style={{ width: `${wrongRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeStudent;
