import RoleUsersPieChart from "./RoleUsersPieChart";
import { useSelector , useDispatch } from "react-redux";
import { useEffect, useMemo } from "react";
import { fetchAllUsers } from "@/store/slices/adminSlice";
import { SpinnerCustom } from "@/components/ui/spinner";

const countRoles = (users) => {
  const roleCounts = {
    admin: 0,
    teacher: 0,
    student: 0,
  };

  users.forEach((user) => {
    if (user.role === "admin") {
      roleCounts.admin++;
    } else if (user.role === "teacher") {
      roleCounts.teacher++;
    } else if (user.role === "student") {
      roleCounts.student++;
    }
  });

  return roleCounts;
};

function RoleUsersData() {
    const dispatch = useDispatch();
    const { users, loading, error } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(fetchAllUsers())
    },[dispatch])

    const roleCounts = useMemo(() => countRoles(users), [users]);

    const chartData = [
        { role: "admin", users: roleCounts.admin, fill: "var(--color-admin)" },
        { role: "teacher", users: roleCounts.teacher, fill: "var(--color-teacher)" },
        { role: "student", users: roleCounts.student, fill: "var(--color-student)" },
  ];

  const chartConfig = {
    users: {
      label: "Users",
    },
    admin: {
      label: "Administrator",
      color: "#e11d48",
    },
    teacher: {
      label: "Teacher",
      color: "#d97706",
    },
    student: {
      label: "Student",
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
  
  return <div className="space-y-3">
    <RoleUsersPieChart chartData={chartData} chartConfig={chartConfig} />
    <div className="grid grid-cols-3 gap-2 px-2 text-xs">
      {chartData.map(({ role, users }) => (
        <div key={role} className="flex items-center gap-2 text-muted-foreground">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: chartConfig[role].color }}
          />
          <span>{chartConfig[role].label}: {users}</span>
        </div>
      ))}
    </div>
  </div>;
}

export default RoleUsersData;
