import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SpinnerCustom } from "@/components/ui/spinner";
import { fetchTeacherCoursesCount } from "@/store/slices/adminSlice";
import TeacherCoursesBarChart from "./TeacherCoursesBarChart";

function TeacherCoursesData() {
    const dispatch = useDispatch();
    const { courseCounts, loading, error } = useSelector((state) => state.admin);

    useEffect(() => {
      dispatch(fetchTeacherCoursesCount());
    }, [dispatch]);

    if (loading) {
      return (
        <div className="flex min-h-[250px] items-center justify-center rounded-md border bg-background">
          <SpinnerCustom className="text-teal-700 [&>svg]:size-9" />
        </div>
      );
    }

    if (error) {
      return <div className="p-6 text-center text-rose-600">Error: {error}</div>;
    }

    const data = courseCounts.map(({ id, teacherName, count }) => ({
      id,
      teacher: teacherName || "Unknown teacher",
      count: Number(count) || 0,
    }));

    const chartData = data
      .filter((item) => item.count > 0)
      .sort((firstItem, secondItem) => secondItem.count - firstItem.count)
      .slice(0, 5);

    if (chartData.length === 0) {
      return <div className="p-6 text-center text-muted-foreground">No course data found.</div>;
    }

    return <TeacherCoursesBarChart chartData={chartData} />;
}

export default TeacherCoursesData;
