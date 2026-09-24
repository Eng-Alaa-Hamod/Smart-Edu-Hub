import DataTable from "@/components/table/DataTable";
import { ConfirmDialog } from "@/components/multi use/ConfirmDialog";
import { SpinnerCustom } from "@/components/ui/spinner";
import { deleteBookLesson, fetchAllBookLessons } from "@/store/slices/BookLessonSlice";
import { ArrowUpDownIcon, CalendarCheck, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";

const formatDate = (value) => {
  const date = value?.toDate ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
};

const header = (label) => ({ column }) => (
  <Button
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    variant="ghost"
    className="h-auto min-h-9 w-full justify-center whitespace-normal break-words px-1 text-center text-xs sm:text-sm"
  >
    {label}
    <ArrowUpDownIcon className="ml-2 size-4 shrink-0" />
  </Button>
);

function Bookings() {
  const dispatch = useDispatch();
  const { books, loading, error } = useSelector((state) => state.bookLesson);

  useEffect(() => {
    dispatch(fetchAllBookLessons());
  }, [dispatch]);

  const data = (books || []).map((book) => ({
    ...book,
    teacherName: book.teacherName || "Teacher",
    studentName: book.studentName || "Student",
    createdAtLabel: formatDate(book.createdAt),
    lessonDate: formatDate(book.date),
    status: book.status || "pending",
  }));

  const columns = [
    { accessorKey: "teacherName", header: header("Teacher name") },
    { accessorKey: "studentName", header: header("Student name") },
    { accessorKey: "createdAtLabel", header: header("Created at") },
    { accessorKey: "lessonDate", header: header("Lesson date") },
    {
      accessorKey: "status",
      header: header("Student status"),
      cell: ({ row }) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
            row.getValue("status") === "accepted"
              ? "bg-emerald-50 text-emerald-700"
              : row.getValue("status") === "rejected"
                ? "bg-rose-50 text-rose-700"
                : "bg-amber-50 text-amber-700"
          }`}
        >
          {row.getValue("status")}
        </span>
      ),
    },
    { accessorKey: "startTime", header: header("Session start") },
    { accessorKey: "endTime", header: header("Session end") },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => (
        <ConfirmDialog
          trigger={
            <button
              type="button"
              disabled={loading}
              className="mx-auto flex rounded-lg bg-rose-50 p-2 text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
              title="Delete booking"
              aria-label={`Delete booking for ${row.original.studentName}`}
            >
              <Trash2 className="size-4" />
            </button>
          }
          title="Delete this booking?"
          description="This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          confirmVariant="destructive"
          onConfirm={() => dispatch(deleteBookLesson({ bookingId: row.original.id }))}
        />
      ),
    },
  ];

  if (loading && !books.length) {
    return <SpinnerCustom className="min-h-[calc(100vh-5rem)] text-sky-600" />;
  }

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-slate-50/70 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1600px]">
        <header className="mb-6 border-b border-slate-200 pb-6">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">
            <CalendarCheck className="size-4" /> Admin workspace
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Lesson bookings
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            View and manage every lesson booking in the platform.
          </p>
        </header>

        {error && <p className="mb-4 rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        <DataTable columns={columns} data={data} className="max-w-none" />
      </div>
    </main>
  );
}

export default Bookings;