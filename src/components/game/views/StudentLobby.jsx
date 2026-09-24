import { useSelector } from "react-redux";

export default function StudentLobby() {
    
  const { name, room } = useSelector((s) => s.game);
  const players = Object.values(room.players || {});

  return (
    <div className="mx-auto mt-3 w-full max-w-5xl space-y-5 rounded-3xl border border-sky-100 bg-white p-5 shadow-xl shadow-sky-100/60 sm:p-8">
      <div className="rounded-2xl bg-gradient-to-r from-sky-500 to-teal-500 p-6 text-white">
        <p className="text-sm font-medium text-sky-100">You are in the room</p>
        <h2 className="mt-2 text-2xl font-bold">Welcome {name}</h2>
        <p className="mt-2 text-sm text-white/85">Waiting for the host to start the game.</p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {players.map((p, i) => (
          <li key={i} className="rounded-xl border border-sky-100 bg-sky-50/40 p-3 font-medium text-slate-700">{p.name}</li>
        ))}
      </ul>
    </div>
  );
}