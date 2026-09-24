import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { SpinnerCustom } from "@/components/ui/spinner";
import BookingsCreatedLast7daysChart from "./BookingsCreatedLast7daysChart";
import { format, isAfter, subDays, isValid } from "date-fns";

function BookingsCreatedLast7daysData() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const snapshot = await getDocs(collection(db, "bookings"));
        setBookings(snapshot.docs.map((docSnap) => docSnap.data()));
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const chartData = useMemo(() => {
    if (!bookings || bookings.length === 0) return [];

    const sevenDaysAgo = subDays(new Date(), 7);

    const bookingsLastWeek = bookings
      .map((booking) => {
        const date = booking.createdAt?.toDate
          ? booking.createdAt.toDate()
          : new Date(booking.createdAt);
        return { date, day: format(date, "MMM d") };
      })
      .filter(({ date }) => isValid(date) && isAfter(date, sevenDaysAgo))
      .sort((a, b) => a.date - b.date);

    return bookingsLastWeek.reduce((days, booking) => {
      const existingDay = days.find((day) => day.day === booking.day);

      if (existingDay) {
        existingDay.count += 1;
      } else {
        days.push({ day: booking.day, count: 1 });
      }

      return days;
    }, []);
  }, [bookings]);

  if (loading) {
    return <SpinnerCustom className="min-h-24 text-sky-600 [&>svg]:size-9" />;
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  return (
    <div className="w-full">
      <BookingsCreatedLast7daysChart chartData={chartData} />
    </div>
  );
}

export default BookingsCreatedLast7daysData;