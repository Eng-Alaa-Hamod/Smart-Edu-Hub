/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";

export const AutoAdvance = ({ time = 30, onComplete }) => {
	const [seconds, setSeconds] = useState(time);

	useEffect(() => {
		setSeconds(time);
	}, [time]);

	useEffect(() => {
		if (seconds <= 0) {
			onComplete();
			return;
		}

		const timer = setTimeout(() => {
			setSeconds((prev) => prev - 1);
		}, 1000);

		return () => clearTimeout(timer);
	}, [seconds]);

	return (
		<p className="rounded-xl bg-amber-50 p-4 text-center text-lg font-bold text-amber-700">
			Next screen in: {seconds}s
		</p>
	);
};

export default AutoAdvance;
