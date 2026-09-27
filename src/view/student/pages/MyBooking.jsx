import { useEffect } from "react";
import { CalendarDays, Clock3, Mail, Trash2, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteBookLesson, fetchBooksForStudent } from "@/store/slices/BookLessonSlice";
import { SpinnerCustom } from "@/components/ui/spinner";
import { ConfirmDialog } from "@/components/multi use/ConfirmDialog";

function MyBooking() {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user.user);
	const { books, loading, error } = useSelector((state) => state.bookLesson);

	useEffect(() => {
		if (user?.uid) dispatch(fetchBooksForStudent({ studentId: user.uid }));
	}, [dispatch, user?.uid]);

	const formatDate = (value) => {
		const date = value?.toDate ? value.toDate() : new Date(value);
		return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleDateString();
	};

	const handleDelete = (bookingId) => {
		dispatch(deleteBookLesson({ bookingId }));
	};

	return (
		<main className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-sky-50 via-white to-emerald-50/70 p-4 sm:p-6 lg:p-8">
			<div className="mx-auto max-w-6xl space-y-6">
				<header className="rounded-3xl bg-gradient-to-r from-sky-600 via-teal-500 to-emerald-500 p-6 text-white shadow-xl shadow-sky-100 sm:p-8">
					<p className="flex items-center gap-2 text-sm font-medium text-sky-100"><CalendarDays className="h-4 w-4" /> Student Area</p>
					<h1 className="mt-2 text-3xl font-bold">My Bookings</h1>
					<p className="mt-2 text-sm text-white/85">Review your lesson requests and scheduled times.</p>
				</header>

				{loading && !books.length && <SpinnerCustom className="min-h-24 text-sky-600" />}
				{error && <p className="mt-5 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
				{!loading && !error && !books.length && <p className="rounded-2xl border border-sky-100 bg-white p-8 text-center text-slate-500 shadow-sm">No bookings yet.</p>}

				<section className="grid gap-5 md:grid-cols-2">
					{books.map((book) => (
						<article key={book.id} className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:p-6">
							<div className="flex items-start justify-between gap-4">
								<div className="flex items-center gap-3">
									<div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-sky-50 text-sky-600">
										{book.teacherPhotoURL ? <img src={book.teacherPhotoURL} alt={book.teacherName || "Teacher"} className="h-full w-full object-cover" /> : <User className="h-6 w-6" />}
									</div>
									<div>
										<h2 className="font-bold text-teal-800">{book.teacherName || "Teacher"}</h2>
										<p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500"><Mail className="h-4 w-4" />{book.teacherEmail || "No email available"}</p>
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
						</article>
					))}
				</section>
			</div>
		</main>
	);
}

export default MyBooking;
