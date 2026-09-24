import BadgeMedalsPieChart from "./BadgeMedalsPieChart";
import { useSelector , useDispatch } from "react-redux";
import { useEffect, useMemo } from "react";
import { fetchStudentAchievements } from "@/store/slices/adminSlice";
import { SpinnerCustom } from "@/components/ui/spinner";

const countMedals = (achievements) => {
	const medalCounts = {
		gold: 0,
		silver: 0,
		bronze: 0,
	};

	achievements.forEach((achievement) => {
		const badges = achievement.badges || {};
		medalCounts.gold += badges.gold || 0;
		medalCounts.silver += badges.silver || 0;
		medalCounts.bronze += badges.bronze || 0;
	});

	return medalCounts;
};

function BadgeMedalsData() {
		const dispatch = useDispatch();
		const { studentAchievements, loading, error } = useSelector((state) => state.admin);

		useEffect(() => {
				dispatch(fetchStudentAchievements())
		},[dispatch])

		const medalCounts = useMemo(() => countMedals(studentAchievements || []), [studentAchievements]);

		const chartData = [
				{ medal: "gold", medals: medalCounts.gold, fill: "var(--color-gold)" },
				{ medal: "silver", medals: medalCounts.silver, fill: "var(--color-silver)" },
				{ medal: "bronze", medals: medalCounts.bronze, fill: "var(--color-bronze)" },
	];

	const chartConfig = {
		medals: {
			label: "Medals",
		},
		gold: {
			label: "Gold",
			color: "#eab308",
		},
		silver: {
			label: "Silver",
			color: "#64748b",
		},
		bronze: {
			label: "Bronze",
			color: "#b45309",
		},
	};

	if (loading)
		return (
			<div className="flex min-h-[250px] items-center justify-center rounded-md border bg-background">
				<SpinnerCustom className="text-teal-700 [&>svg]:size-9" />
			</div>
		);

	if (error)
		return <div className="p-6 text-center text-rose-600">Error: {error}</div>;

	return <div>
		<BadgeMedalsPieChart chartData={chartData} chartConfig={chartConfig} />
	</div>;
}

export default BadgeMedalsData;
