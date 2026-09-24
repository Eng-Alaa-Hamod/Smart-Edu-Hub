import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Award, Medal, Trophy } from "lucide-react";
import { savePlayerAchievement } from "@/store/slices/PLayerSaveAchivementSlice";

export default function PlayerEnd() {
  const dispatch = useDispatch();
  const { uid, pin, room } = useSelector((s) => s.game);
  const sorted = Object.entries(room.players || {})
    .map(([id, p]) => ({ id, ...p }))
    .sort((a, b) => b.score - a.score);
  const myRank = sorted.findIndex((p) => p.id === uid) + 1;
  const badges = {
    1: {
      label: "Gold Champion",
      Icon: Trophy,
      className: "border-amber-200 bg-amber-50 text-amber-700",
    },
    2: {
      label: "Silver Champion",
      Icon: Medal,
      className: "border-slate-200 bg-slate-100 text-slate-700",
    },
    3: {
      label: "Bronze Champion",
      Icon: Award,
      className: "border-orange-200 bg-orange-50 text-orange-700",
    },
  };
  const badge = badges[myRank];
  const BadgeIcon = badge?.Icon;

  useEffect(() => {
    if (uid && pin && room) {
      dispatch(
        savePlayerAchievement({
          uid,
          pin,
          room,
          badgeType: badge?.label?.split(" ")[0]?.toLowerCase() || null,
        }),
      );
    }
  }, [dispatch, uid, pin, room, badge]);

  return (
    <div className="mx-auto mt-3 w-full max-w-5xl space-y-5 rounded-3xl border border-sky-100 bg-white p-5 shadow-xl shadow-sky-100/60 sm:p-8">
      <div className="rounded-2xl bg-gradient-to-r from-sky-500 to-teal-500 p-6 text-white">
        <p className="text-sm font-medium text-sky-100">Final results</p>
        <h2 className="mt-1 text-3xl font-bold">Game Over</h2>
      </div>
      <p className="rounded-2xl bg-emerald-50 p-5 font-semibold text-emerald-700">
        Your rank: #{myRank} — Score: {room.players[uid]?.score}
      </p>
      {badge && (
        <div className={`flex items-center gap-3 rounded-2xl border p-5 font-bold ${badge.className}`}>
          <BadgeIcon className="h-8 w-8" />
          <span>{badge.label}</span>
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-3">
        {sorted.slice(0, 3).map((player, index) => {
          const topBadge = badges[index + 1];
          const TopBadgeIcon = topBadge.Icon;
          return (
            <div key={player.id} className={`rounded-2xl border p-4 ${topBadge.className}`}>
              <div className="flex items-center gap-2 font-bold">
                <TopBadgeIcon className="h-5 w-5" />
                <span>#{index + 1} {player.name}</span>
              </div>
              <p className="mt-2 text-sm font-semibold">Score: {player.score || 0}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
