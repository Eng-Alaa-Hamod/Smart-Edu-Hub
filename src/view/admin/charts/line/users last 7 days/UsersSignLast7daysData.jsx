import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { fetchAllUsers } from "@/store/slices/adminSlice";
import { SpinnerCustom } from "@/components/ui/spinner";
import ChartLineDefault from "./UsersSignLast7daysChart";
import { format, isAfter, subDays, isValid } from "date-fns";

function UsersSignLast7daysData() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const chartData = useMemo(() => {
    if (!users || users.length === 0) return [];

    const sevenDaysAgo = subDays(new Date(), 7);

    const usersLastWeek = users
  .map((user) => {
    const date = user.createdAt?.toDate? user.createdAt.toDate() : new Date(user.createdAt);
    return { date, day: format(date, "MMM d") };
  })
  .filter(({ date }) => isValid(date) && isAfter(date, sevenDaysAgo))
  .sort((a, b) => a.date - b.date);

    return usersLastWeek.reduce((days, user) => {
      const existingDay = days.find((day) => day.day === user.day);

      if (existingDay) {
        existingDay.count += 1;
      } else {
        days.push({ day: user.day, count: 1 });
      }

      return days;
    }, []);
  }, [users]);

  if (loading) {
    return <SpinnerCustom className="min-h-24 text-sky-600 [&>svg]:size-9" />;
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  return (
    <div className="w-full">
      <ChartLineDefault chartData={chartData} />
    </div>
  );
}

export default UsersSignLast7daysData;
