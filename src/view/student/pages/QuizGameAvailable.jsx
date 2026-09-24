import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Gamepad2, LogIn } from "lucide-react";
import QuizGame from "@/components/game/QuizGame";
import { joinRoom } from "@/store/slices/GameSlice";
import { SpinnerCustom } from "@/components/ui/spinner";

function QuizGameAvailable() {
  const dispatch = useDispatch();
  const { pin, loading, error } = useSelector((state) => state.game);
  const user = useSelector((state) => state.user.user);
  const [roomPin, setRoomPin] = useState("");
  const playerName =
    `${user?.firstName || ""} ${user?.secondName || ""}`.trim() ||
    user?.displayName ||
    user?.email ||
    "Player";

  if (pin) return <QuizGame />;

  const handleJoin = (event) => {
    event.preventDefault();
    dispatch(
      joinRoom({
        pin: roomPin.trim(),
        uid: user.uid,
        name: playerName,
        email: user.email || "",
      }),
    );
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-sky-50 via-white to-emerald-50/70">
      <div className="mx-auto max-w-2xl p-4 sm:p-6 lg:p-8">
        <div className="rounded-3xl border border-sky-100 bg-white p-5 shadow-xl shadow-sky-100/60 sm:p-8">
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-sky-500 to-teal-500 p-6 text-white">
            <Gamepad2 className="h-8 w-8 text-sky-100" />
            <h2 className="mt-3 text-3xl font-bold">Join Quiz</h2>
            <p className="mt-2 text-sm text-white/85">
              Enter the room PIN to play.
            </p>
          </div>
          <form onSubmit={handleJoin} className="space-y-5">
            <label className="block text-sm font-medium text-slate-700">
              Room PIN
              <input
                value={roomPin}
                onChange={(event) => setRoomPin(event.target.value)}
                className="mt-2 w-full rounded-xl border border-sky-100 px-4 py-3 text-slate-700 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                required
              />
            </label>
            <button
              disabled={loading}
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && <SpinnerCustom />}
              <LogIn className="h-5 w-5" />
              Join
            </button>
          </form>
          {error && (
            <p className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-600">
              {error}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

export default QuizGameAvailable;
