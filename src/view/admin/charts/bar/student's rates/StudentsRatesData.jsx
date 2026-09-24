import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { SpinnerCustom } from "@/components/ui/spinner";
import StudentsRatesChart from "./StudentsRatesChart";

function StudentsRatesData() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const snapshot = await getDocs(collection(db, "playerAchievements"));
        const achievements = snapshot.docs
          .map((achievementDoc, index) => ({
            name: achievementDoc.data().name || "Unknown student",
            rate: Number(achievementDoc.data().rate) || 0,
            fill: `var(--color-achievement-${index})`,
          }))
          .sort(
            (firstStudent, secondStudent) =>
              secondStudent.rate - firstStudent.rate,
          )
          .slice(0, 5)
          .map((achievement, index) => ({
            ...achievement,
            fill: `var(--color-achievement-${index})`,
          }));

        setChartData(achievements);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[250px] items-center justify-center rounded-md border bg-background">
        <SpinnerCustom className="text-teal-700 [&>svg]:size-9" />
      </div>
    );
  }

  if (error) return <div className="p-6 text-center text-rose-600">Error: {error}</div>;

  if (chartData.length === 0) {
    return <div className="p-6 text-center text-muted-foreground">No student rate data found.</div>;
  }

  return <StudentsRatesChart chartData={chartData} />;
}

export default StudentsRatesData;
