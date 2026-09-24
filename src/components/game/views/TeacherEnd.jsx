import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Award, Medal, Trophy } from "lucide-react";
import { deleteGame } from "@/store/slices/GameSlice";
import { saveGameAchievements } from "@/store/slices/PLayerSaveAchivementSlice";
import { SpinnerCustom } from "@/components/ui/spinner";
import { ConfirmDialog } from "@/components/multi use/ConfirmDialog";

export default function TeacherEnd() {
  const dispatch = useDispatch();
  const { pin, room, loading } = useSelector((s) => s.game);

  useEffect(() => {
    if (pin && room) dispatch(saveGameAchievements({ pin, room }));
  }, [dispatch, pin, room]);

  const sorted = Object.entries(room.players || {})
    .map(([uid, p]) => ({ uid, ...p }))
    .sort((a, b) => b.score - a.score);
  const badges = [
    { label: "Gold", Icon: Trophy, className: "border-amber-200 bg-amber-50 text-amber-700" },
    { label: "Silver", Icon: Medal, className: "border-slate-200 bg-slate-100 text-slate-700" },
    { label: "Bronze", Icon: Award, className: "border-orange-200 bg-orange-50 text-orange-700" },
  ];

  return (
    <div className="mx-auto mt-3 w-full max-w-5xl space-y-5 rounded-3xl border border-sky-100 bg-white p-5 shadow-xl shadow-sky-100/60 sm:p-8">
      <div className="rounded-2xl bg-gradient-to-r from-sky-500 to-teal-500 p-6 text-white">
        <p className="text-sm font-medium text-sky-100">Final results</p>
        <h2 className="mt-1 text-3xl font-bold">Game Over</h2>
      </div>
      <ol className="space-y-3">
        {sorted.map((p, i) => (
          <li key={p.uid} className="flex items-center justify-between rounded-xl border border-sky-100 bg-sky-50/40 p-4">
            <span className="font-semibold text-slate-700">#{i + 1} {p.name}</span>
            <span className="font-bold text-teal-700">{p.score}</span>
          </li>
        ))}
      </ol>
      <div className="grid gap-3 sm:grid-cols-3">
        {sorted.slice(0, 3).map((player, index) => {
          const badge = badges[index];
          const BadgeIcon = badge.Icon;
          return (
            <div key={player.uid} className={`rounded-2xl border p-4 ${badge.className}`}>
              <div className="flex items-center gap-2 font-bold">
                <BadgeIcon className="h-5 w-5" />
                <span>#{index + 1} {player.name}</span>
              </div>
              <p className="mt-2 text-sm font-semibold">{badge.label} - {player.score || 0} points</p>
            </div>
          );
        })}
      </div>
      <ConfirmDialog
        trigger={<button type="button" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60">{loading && <SpinnerCustom />} Close Room</button>}
        title="Close this game room?"
        description="Players will no longer be able to access this room after it is closed."
        confirmText="Close room"
        cancelText="Cancel"
        confirmVariant="destructive"
        onConfirm={() => dispatch(deleteGame({ pin }))}
      />
    </div>
  );
}