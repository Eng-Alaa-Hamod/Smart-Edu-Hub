import { useEffect } from "react";
import { Award, ArrowUpDownIcon, Trophy } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import { SpinnerCustom } from "@/components/ui/spinner";
import { fetchStudentAchievements } from "@/store/slices/adminSlice";

const sortableHeader =
  (label) =>
  ({ column }) => (
    <Button
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      variant="ghost"
      className="w-full justify-center text-center"
    >
      {label}
      <ArrowUpDownIcon className="ml-2 size-4" />
    </Button>
  );

function MedalCell({ badges }) {
  const medals = [
    {
      key: "gold",
      value: badges.gold || 0,
      className: "text-amber-500",
      label: "Gold medals",
    },
    {
      key: "silver",
      value: badges.silver || 0,
      className: "text-slate-500",
      label: "Silver medals",
    },
    {
      key: "bronze",
      value: badges.bronze || 0,
      className: "text-orange-700",
      label: "Bronze medals",
    },
  ];

  return (
    <div className="flex justify-center gap-3" aria-label="Medal counts">
      {medals.map((medal) => (
        <span
          key={medal.key}
          title={medal.label}
          className={`inline-flex items-center gap-1 font-bold ${medal.className}`}
        >
          <Award className="h-4 w-4" />
          {medal.value}
        </span>
      ))}
    </div>
  );
}

function StudentAchievements() {
  const dispatch = useDispatch();
  const { studentAchievements, loading, error } = useSelector(
    (state) => state.admin,
  );

  useEffect(() => {
    dispatch(fetchStudentAchievements());
  }, [dispatch]);

  const data = (studentAchievements || []).map((achievement) => ({
    id: achievement.uid,
    name: achievement.name || "Unknown student",
    email: achievement.email || "-",
    badges: achievement.badges || {},
    totalScore: achievement.totalScore || 0,
    totalQuestions: achievement.totalQuestions || 0,
    correctAnswers: achievement.totalCorrectAnswers || 0,
    gamesPlayed: achievement.gamesPlayed || 0,
  }));

  const columns = [
    {
      accessorKey: "name",
      header: sortableHeader("Student name"),
      cell: ({ row }) => (
        <div className="text-center font-medium text-slate-900">
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: sortableHeader("Email"),
      cell: ({ row }) => (
        <div className="text-center lowercase text-slate-600">
          {row.getValue("email")}
        </div>
      ),
    },
    {
      accessorKey: "badges",
      header: () => <div className="text-center">Medals</div>,
      enableSorting: false,
      cell: ({ row }) => <MedalCell badges={row.getValue("badges")} />,
    },
    {
      accessorKey: "totalScore",
      header: sortableHeader("Total points"),
      cell: ({ row }) => (
        <div className="text-center font-bold text-teal-700">
          {row.getValue("totalScore")}
        </div>
      ),
    },
    {
      accessorKey: "totalQuestions",
      header: sortableHeader("Questions"),
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("totalQuestions")}</div>
      ),
    },
    {
      accessorKey: "correctAnswers",
      header: sortableHeader("Correct answers"),
      cell: ({ row }) => (
        <div className="text-center font-semibold text-emerald-600">
          {row.getValue("correctAnswers")}
        </div>
      ),
    },
    {
      accessorKey: "gamesPlayed",
      header: sortableHeader("Games played"),
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("gamesPlayed")}</div>
      ),
    },
  ];

  if (loading)
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-slate-50/70">
        <SpinnerCustom className="text-teal-700 [&>svg]:size-9" />
      </div>
    );
  if (error)
    return <div className="p-6 text-center text-rose-600">Error: {error}</div>;

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-slate-50/70 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 flex items-end justify-between border-b border-slate-200 pb-6">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">
              <Trophy className="size-4" /> Admin workspace
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Student achievements
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Scores, answered questions, correct answers, games, and medal
              counts.
            </p>
          </div>
        </div>
        <DataTable columns={columns} data={data} className="max-w-none" />
      </div>
    </main>
  );
}

export default StudentAchievements;
