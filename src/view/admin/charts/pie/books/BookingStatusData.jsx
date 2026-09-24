import BookingStatusPieChart from "./BookingStatusPieChart";
import { useSelector , useDispatch } from "react-redux";
import { useEffect, useMemo } from "react";
import { fetchAllBookLessons } from "@/store/slices/BookLessonSlice";
import { SpinnerCustom } from "@/components/ui/spinner";

const countBookingStatuses = (books) => {

	const statusCounts = {
		pending: 0,
		accepted: 0,
		rejected: 0,
	};

	books.forEach((book) => {
        
		const status = book.status || "pending";

		if (statusCounts[status] !== undefined) {
			statusCounts[status]++;
		}
	});

	return statusCounts;
};

function BookingStatusData() {
		const dispatch = useDispatch();
		const { books, loading, error } = useSelector((state) => state.bookLesson);

		useEffect(() => {
				dispatch(fetchAllBookLessons())
		},[dispatch])

		const statusCounts = useMemo(() => countBookingStatuses(books || []), [books]);

		const chartData = [
				{ status: "pending", bookings: statusCounts.pending, fill: "var(--color-pending)" },
				{ status: "accepted", bookings: statusCounts.accepted, fill: "var(--color-accepted)" },
				{ status: "rejected", bookings: statusCounts.rejected, fill: "var(--color-rejected)" },
	];

	const chartConfig = {
		bookings: {
			label: "Bookings",
		},
		pending: {
			label: "Pending",
			color: "#d97706",
		},
		accepted: {
			label: "Accepted",
			color: "#059669",
		},
		rejected: {
			label: "Rejected",
			color: "#e11d48",
		},
	};

	if (loading)
		return (
			<div className="flex min-h-[250px] items-center justify-center rounded-md border bg-background">
				<SpinnerCustom className="text-teal-700 [&>svg]:size-9" />
			</div>
		);

	if (error)
		return <div className="p-6 text-center text-rose-600">Error: {error}</div>;

	return <div>
		<BookingStatusPieChart chartData={chartData} chartConfig={chartConfig} />
	</div>;
}

export default BookingStatusData;
