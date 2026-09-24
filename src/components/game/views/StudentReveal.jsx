import { useSelector } from "react-redux";

export default function StudentReveal() {
  const { uid, room } = useSelector((s) => s.game);
  
  const index = room.currentQuestionIndex;
  const correct = room.correctAnswerIndex;
  const myChoice = room.answers?.[index]?.[uid]?.choice;
  const isCorrect = myChoice === correct;
  const gain = room.players?.[uid]?.lastGain || 0;

  return (
    <div className="mx-auto mt-3 w-full max-w-5xl space-y-5 rounded-3xl border border-sky-100 bg-white p-5 shadow-xl shadow-sky-100/60 sm:p-8">
      <div className={`rounded-2xl p-6 ${isCorrect ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"}`}>
        <p className="text-2xl font-bold">{isCorrect ? `Correct! +${gain}` : "Wrong. +0"}</p>
        <p className="mt-1 text-sm font-medium">The answer has been revealed.</p>
      </div>
      <p className="rounded-2xl bg-sky-50 p-5 text-base font-semibold text-teal-800">
        Correct answer: {room.questions[index].options[correct]}
      </p>
    </div>
  );
}