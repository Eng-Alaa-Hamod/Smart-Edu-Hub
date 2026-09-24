import DisableUsersPieChart from "./DisableUsersPieChart";
import { useSelector , useDispatch } from "react-redux";
import { useEffect, useMemo } from "react";
import { fetchAllUsers } from "@/store/slices/adminSlice";
import { SpinnerCustom } from "@/components/ui/spinner";

const countDisableUsers = (users) => {
  const disableCounts = {
    disabled: 0,
    active: 0,
  };

  users.forEach((user) => {
    if (user.isDisable === true) {
      disableCounts.disabled++;
    } else {
      disableCounts.active++;
    }
  });

  return disableCounts;
};

function DisableUsersData() {
    const dispatch = useDispatch();
    const { users, loading, error } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(fetchAllUsers())
    },[dispatch])

    const disableCounts = useMemo(() => countDisableUsers(users), [users]);

    const chartData = [
      { status: "disabled", users: disableCounts.disabled, fill: "var(--color-disabled)" },
      { status: "active", users: disableCounts.active, fill: "var(--color-active)" },
  ];

  const chartConfig = {
    users: {
      label: "Users",
    },
    disabled: {
      label: "Disabled",
      color: "#e11d48",
    },
    active: {
      label: "Active",
      color: "#059669",
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
    <DisableUsersPieChart chartData={chartData} chartConfig={chartConfig} />
  </div>;
}

export default DisableUsersData;
