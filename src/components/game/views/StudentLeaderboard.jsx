import { useSelector } from "react-redux";

export default function StudentLeaderboard() {
  const { uid, room } = useSelector((s) => s.game);
  const sorted = Object.entries(room.players || {})
    .map(([id, p]) => ({ id, ...p }))
    .sort((a, b) => b.score - a.score);

  const myRank = sorted.findIndex((p) => p.id === uid) + 1;

  return (
    <div className="mx-auto mt-3 w-full max-w-5xl space-y-5 rounded-3xl border border-sky-100 bg-white p-5 shadow-xl shadow-sky-100/60 sm:p-8">
      <div>
        <p className="text-sm font-semibold text-sky-600">Live results</p>
        <h2 className="mt-1 text-3xl font-bold text-teal-800">Leaderboard</h2>
      </div>
      <p className="rounded-2xl bg-emerald-50 p-5 font-semibold text-emerald-700">
        Your rank: #{myRank} — Score: {room.players[uid]?.score}
      </p>
      <ol className="space-y-3">
        {sorted.map((p) => (
          <li key={p.id} className="flex items-center justify-between rounded-xl border border-sky-100 bg-sky-50/40 p-4">
            <span className="font-semibold text-slate-700">{p.name}</span>
            <span className="font-bold text-teal-700">{p.score}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}