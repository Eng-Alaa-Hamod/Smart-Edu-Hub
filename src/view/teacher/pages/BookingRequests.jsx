import { useEffect } from "react";
import { CalendarDays, Clock3, Mail, Trash2, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteBookLesson, fetchBooksForTeacher, updateBookLessonStatus } from "@/store/slices/BookLessonSlice";
import { SpinnerCustom } from "@/components/ui/spinner";
import { ConfirmDialog } from "@/components/multi use/ConfirmDialog";

function BookingRequests() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const { books, loading, error } = useSelector((state) => state.bookLesson);

  useEffect(() => {
    if (user?.uid) dispatch(fetchBooksForTeacher({ teacherId: user.uid }));
  }, [dispatch, user?.uid]);

  const formatDate = (value) => {
    const date = value?.toDate ? value.toDate() : new Date(value);
    return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleDateString();
  };

  const handleDelete = (bookingId) => {
    dispatch(deleteBookLesson({ bookingId }));
  };

  const handleStatus = (bookingId, status) => {
    dispatch(updateBookLessonStatus({ bookingId, status }));
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-sky-50 via-white to-emerald-50/70 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl bg-gradient-to-r from-sky-600 via-teal-500 to-emerald-500 p-6 text-white shadow-xl shadow-sky-100 sm:p-8">
          <p className="flex items-center gap-2 text-sm font-medium text-sky-100">
            <CalendarDays className="h-4 w-4" /> Teacher Workspace
          </p>
          <h1 className="mt-2 text-3xl font-bold">Booking Requests</h1>
          <p className="mt-2 text-sm text-white/85">Review lesson requests from your students.</p>
        </header>

        {loading && !books.length && <SpinnerCustom className="min-h-24 text-sky-600" />}
        {error && <p className="mt-5 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {!loading && !error && !books.length && (
          <p className="rounded-2xl border border-sky-100 bg-white p-8 text-center text-slate-500 shadow-sm">No booking requests yet.</p>
        )}

        <section className="grid gap-5 md:grid-cols-2">
          {books.map((book) => (
            <article key={book.id} className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="font-bold text-teal-800">{book.studentName || "Student"}</h2>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500"><Mail className="h-4 w-4" />{book.studentEmail || "No email available"}</p>
                  </div>
                </div>
                <ConfirmDialog
                  trigger={<button type="button" disabled={loading} className="rounded-xl bg-rose-50 p-2.5 text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50" title="Delete request">{loading ? <SpinnerCustom inline spinnerClassName="text-rose-600"  /> : <Trash2 className="h-4 w-4" />}</button>}
                  title="Delete booking request?"
                  description="This action cannot be undone."
                  confirmText="Delete"
                  cancelText="Cancel"
                  confirmVariant="destructive"
                  onConfirm={() => handleDelete(book.id)}
                />
              </div>
              <div className="mt-5 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
                <p className="flex items-center gap-2 rounded-xl bg-sky-50 p-3 text-sm font-medium text-slate-600"><CalendarDays className="h-4 w-4 text-sky-600" />{formatDate(book.date)}</p>
                <p className="flex items-center gap-2 rounded-xl bg-sky-50 p-3 text-sm font-medium text-slate-600"><Clock3 className="h-4 w-4 text-sky-600" />{book.startTime} - {book.endTime}</p>
              </div>
              <span className={`mt-4 inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${book.status === "accepted" ? "bg-emerald-50 text-emerald-700" : book.status === "rejected" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}>
                {book.status || "pending"}
              </span>
              {book.status === "pending" && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <ConfirmDialog
                    trigger={<button type="button" disabled={loading} className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50">Accept</button>}
                    title="Accept this booking request?"
                    description="The student will be notified that this lesson request was accepted."
                    confirmText="Accept"
                    cancelText="Cancel"
                    confirmClassName="bg-emerald-600 text-white hover:bg-emerald-700"
                    onConfirm={() => handleStatus(book.id, "accepted")}
                  />
                  <ConfirmDialog
                    trigger={<button type="button" disabled={loading} className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50">Reject</button>}
                    title="Reject this booking request?"
                    description="The student will be notified that this lesson request was rejected."
                    confirmText="Reject"
                    cancelText="Cancel"
                    confirmVariant="destructive"
                    onConfirm={() => handleStatus(book.id, "rejected")}
                  />
                </div>
              )}
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

export default BookingRequests