import { useEffect, useState } from "react";

export const CountDownQuestionTime = ({ question }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSeconds(question.timeLimit);
  }, [question.timeLimit]);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setTimeout(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

  return (
    <p
      className={`rounded-xl p-4 text-center text-lg font-bold ${seconds === 0 ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-700"}`}
    >
      Timer: {seconds}s
    </p>
  );
};
