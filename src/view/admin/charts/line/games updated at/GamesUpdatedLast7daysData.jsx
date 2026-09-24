import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { SpinnerCustom } from "@/components/ui/spinner";
import GamesUpdatedLast7daysChart from "./GamesUpdatedLast7daysChart";
import { format, isAfter, subDays, isValid } from "date-fns";

function GamesUpdatedLast7daysData() {
  const [playerAchievements, setPlayerAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayerAchievements = async () => {
      try {
        setLoading(true);
        const snapshot = await getDocs(collection(db, "playerAchievements"));
        setPlayerAchievements(snapshot.docs.map((docSnap) => docSnap.data()));
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerAchievements();
  }, []);

  const chartData = useMemo(() => {
    if (!playerAchievements || playerAchievements.length === 0) return [];

    const sevenDaysAgo = subDays(new Date(), 7);

    const gamesLastWeek = playerAchievements
      .flatMap((playerAchievement) => Object.values(playerAchievement.games || {}))
      .map((game) => {
        const date = game.updatedAt?.toDate
          ? game.updatedAt.toDate()
          : new Date(game.updatedAt);
        return { date, day: format(date, "MMM d") };
      })
      .filter(({ date }) => isValid(date) && isAfter(date, sevenDaysAgo))
      .sort((a, b) => a.date - b.date);

    return gamesLastWeek.reduce((days, game) => {
      const existingDay = days.find((day) => day.day === game.day);

      if (existingDay) {
        existingDay.count += 1;
      } else {
        days.push({ day: game.day, count: 1 });
      }

      return days;
    }, []);
  }, [playerAchievements]);

  if (loading) {
    return <SpinnerCustom className="min-h-24 text-sky-600 [&>svg]:size-9" />;
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  return (
    <div className="w-full">
      <GamesUpdatedLast7daysChart chartData={chartData} />
    </div>
  );
}

export default GamesUpdatedLast7daysData;