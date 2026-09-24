import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/store/slices/userSlice";
import { ConfirmDialog } from "@/components/multi use/ConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShieldCheck, User } from "lucide-react";

function ProfileTopBar({ role: roleOverride }) {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = roleOverride || user?.role || "student";
  const profilePath = `/${role}/dashboard/profile`;

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => navigate("/", { replace: true }));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-14 rounded-2xl border-sky-100 bg-white px-2 shadow-sm transition hover:border-sky-200 hover:bg-sky-50 sm:px-3">
          <span className="flex items-center gap-2 sm:gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-sky-100 sm:h-11 sm:w-11">
              <AvatarImage className="h-full w-full object-cover" src={user?.photoURL} alt="Profile" />
              <AvatarFallback>
                {role === "admin" ? (
                  <ShieldCheck className="h-7 w-7" />
                ) : (
                  <User className="h-7 w-7" />
                )}
              </AvatarFallback>
            </Avatar>
            <span className="mr-1 hidden text-left sm:block">
              <span className="block font-semibold text-slate-700">{user?.firstName} {user?.secondName}</span>
              <span className="text-xs text-slate-400">
                {role === "admin"
                  ? "Admin account"
                  : role === "teacher"
                    ? "Teacher account"
                    : "Student account"}
              </span>
            </span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => navigate(profilePath)}>Profile</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => navigate("/change-password")}>Change Password</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <ConfirmDialog
          trigger={<DropdownMenuItem onSelect={(event) => event.preventDefault()}>Log out</DropdownMenuItem>}
          title="Log out of your account?"
          description="You will need to sign in again to access your dashboard."
          confirmText="Log out"
          cancelText="Cancel"
          confirmVariant="destructive"
          onConfirm={handleLogout}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProfileTopBar;