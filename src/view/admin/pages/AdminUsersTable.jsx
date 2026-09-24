import DataTable from "@/components/table/DataTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SpinnerCustom } from "@/components/ui/spinner";
import {
  changeUserCanSendMessageStatus,
  changeUserDisableStatus,
  changeUserRole,
  fetchAllUsers,
} from "@/store/slices/adminSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDownIcon, UsersRound } from "lucide-react";

import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

const roleStyles = {
  admin: "border-rose-200 bg-rose-50 text-rose-700",
  teacher: "border-amber-200 bg-amber-50 text-amber-700",
  student: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

const reportStyles = (count) => {
  if (count < 5) return "text-emerald-600";
  if (count < 10) return "text-yellow-300";
  if (count >= 10) return "text-rose-600";
};

function AdminUsersTable({ roleFilter, title, description }) {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const data = (users || [])
    .filter((user) => !roleFilter || user.role === roleFilter)
    .map((user) => ({
      id: user.id,
      photoURL: user.photoURL ?? "",
      name:
        `${user.firstName ?? ""} ${user.secondName ?? user.lastName ?? ""}`.trim() ||
        "Unnamed user",
      email: user.email ?? "-",
      role: user.role ?? "student",
      isDisable: user.isDisable ?? false,
      canSend: user.canSend ?? true,
      countReports: user.countReports ?? 0,
      joinedAt: user.createdAt,
    }));

  const header = (label) => ({ column }) => (
    <Button
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      variant="ghost"
      className="w-full justify-center text-center"
    >
        {label}
      <ArrowUpDownIcon className="ml-2 size-4" />
    </Button>
  );

  const columns = [
    {
      accessorKey: "photoURL",
      header: header("Photo"),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Avatar className="h-10 w-10 ring-2 ring-slate-100">
            <AvatarImage
              src={row.original.photoURL || undefined}
              alt={row.original.name}
              className="object-cover"
            />
            <AvatarFallback className="bg-sky-100 text-sky-700">
              <UserRound className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: header("Name"),
      cell: ({ row }) => (
        <div className="text-center font-medium text-slate-900">
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: header("Email"),
      cell: ({ row }) => (
        <div className="text-center lowercase text-slate-600">
          {row.getValue("email")}
        </div>
      ),
    },
    {
      accessorKey: "joinedAt",
      header: header("Joined at"),
      cell: ({ row }) => {
        const value = row.getValue("joinedAt");
        const date = value?.toDate ? value.toDate() : new Date(value);
        return (
          <div className="text-center text-slate-600">
            {value && !Number.isNaN(date.getTime()) ? date.toLocaleDateString() : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: header("Role"),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Select
            value={row.getValue("role")}
            onValueChange={(newRole) =>
              dispatch(changeUserRole({ userId: row.original.id, newRole }))
            }
          >
            <SelectTrigger
              className={`w-[140px] justify-center font-medium ${roleStyles[row.getValue("role")] ?? ""}`}
            >
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      ),
    },
    {
      accessorKey: "isDisable",
      header: header("Disabled"),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Switch
            aria-label={`Disable ${row.getValue("name")}`}
            checked={row.getValue("isDisable")}
            onCheckedChange={() =>
              dispatch(changeUserDisableStatus(row.original.id))
            }
          />
        </div>
      ),
    },
    {
      accessorKey: "canSend",
      header: header("Can Send"),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Switch
            aria-label={`Allow ${row.getValue("name")} to send messages`}
            checked={row.getValue("canSend")}
            onCheckedChange={() =>
              dispatch(changeUserCanSendMessageStatus(row.original.id))
            }
          />
        </div>
      ),
    },
    {
      accessorKey: "countReports",
      header: header("Reports"),
      cell: ({ row }) => (
        <div
          className={`text-center text-lg font-bold ${reportStyles(row.getValue("countReports"))}`}
        >
          {row.getValue("countReports")}
        </div>
      ),
    },
  ];

  if (loading)
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-slate-50/70">
        <SpinnerCustom className="text-teal-700 [&>svg]:size-9" />
      </div>
    );
  if (error)
    return <div className="p-6 text-center text-rose-600">Error: {error}</div>;

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-slate-50/70 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">
              <UsersRound className="size-4" />
              Admin workspace
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              {description}
            </p>
          </div>
          <div className="rounded-xl border border-sky-100 bg-white px-5 py-3 text-center shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Total users
            </p>
            <p className="mt-1 text-2xl font-bold text-sky-700">
              {data.length}
            </p>
          </div>
        </div>
        <DataTable columns={columns} data={data} className="max-w-none" />
      </div>
    </main>
  );
}

export default AdminUsersTable;
