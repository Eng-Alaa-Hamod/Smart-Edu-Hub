import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { SpinnerCustom } from "@/components/ui/spinner";
import EnrollmentsLast7daysChart from "./EnrollmentsLast7daysChart";
import { format, isAfter, subDays, isValid } from "date-fns";

function EnrollmentsLast7daysData({ days = 7 }) {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        const snapshot = await getDocs(collection(db, "enrollments"));
        setEnrollments(snapshot.docs.map((docSnap) => docSnap.data()));
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  const chartData = useMemo(() => {
    if (!enrollments || enrollments.length === 0) return [];

    const sevenDaysAgo = subDays(new Date(), days);

    const enrollmentsLastWeek = enrollments
      .map((enrollment) => {
        const date = enrollment.enrolledAt?.toDate
          ? enrollment.enrolledAt.toDate()
          : new Date(enrollment.enrolledAt);
        return { date, day: format(date, "MMM d") };
      })
      .filter(({ date }) => isValid(date) && isAfter(date, sevenDaysAgo))
      .sort((a, b) => a.date - b.date);

    return enrollmentsLastWeek.reduce((days, enrollment) => {
      const existingDay = days.find((day) => day.day === enrollment.day);

      if (existingDay) {
        existingDay.count += 1;
      } else {
        days.push({ day: enrollment.day, count: 1 });
      }

      return days;
    }, []);
  }, [enrollments, days]);

  if (loading) {
    return <SpinnerCustom className="min-h-24 text-sky-600 [&>svg]:size-9" />;
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  return (
    <div className="w-full">
      <EnrollmentsLast7daysChart chartData={chartData} />
    </div>
  );
}

export default EnrollmentsLast7daysData;