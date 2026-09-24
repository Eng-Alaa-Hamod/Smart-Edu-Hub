import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  BookOpen,
  BarChart3,
  CalendarCheck,
  CalendarPlus,
  Download,
  FileQuestion,
  Gamepad2,
  Globe2,
  GraduationCap,
  KeyRound,
  LayoutDashboard,
  Library,
  LogOut,
  MessageCircle,
  LineChart,
  PieChart,
  ShieldCheck,
  PencilRuler,
  NotebookText,
  Trophy,
} from "lucide-react";
import { logoutUser } from "@/store/slices/userSlice";
import { ConfirmDialog } from "@/components/multi use/ConfirmDialog";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { User } from "lucide-react";

const navigationItemsByRole = {
  admin: [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Profile", href: "/admin/dashboard/profile", icon: ShieldCheck },
    { label: "Users", href: "/admin/dashboard/users", icon: User },
    { label: "Teachers" , href: "/admin/dashboard/teachers" , icon: PencilRuler },
    { label: "Bookings", href: "/admin/dashboard/bookings", icon: CalendarCheck },
    { label: "Distributions", href: "/admin/dashboard/charts/distributions", icon: PieChart },
    { label: "Comparisons", href: "/admin/dashboard/charts/comparisons", icon: BarChart3 },
    { label: "Trends", href: "/admin/dashboard/charts/trends", icon: LineChart },
    { label: "Students" , href: "/admin/dashboard/students" , icon: NotebookText },
    { label: "Student achievements", href: "/admin/dashboard/student-achievements", icon: Trophy },
    { label: "Courses", href: "/admin/dashboard/courses", icon: BookOpen },
    { label: "Library", href: "/admin/dashboard/library", icon: Library },
    { label: "Chats", href: "/admin/dashboard/chats", icon: MessageCircle },
    { label: "Change password", href: "/change-password", icon: KeyRound },
    { label: "Install app", href: "/admin/dashboard/install", icon: Download },
  ],
  teacher: [
    { label: "Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
    { label: "Profile", href: "/teacher/dashboard/profile", icon: User },
    { label: "My Courses", href: "/teacher/dashboard/courses", icon: BookOpen },
    { label: "Library", href: "/teacher/dashboard/library", icon: Library },
    { label: "Course chat", href: "/teacher/dashboard/course-chat", icon: MessageCircle },
    { label: "Global chat", href: "/teacher/dashboard/global-chat", icon: Globe2 },
    { label: "Manage Quizzes", href: "/teacher/dashboard/quizzes", icon: FileQuestion },
    { label: "Booking Requests", href: "/teacher/dashboard/bookings", icon: CalendarCheck },
    { label: "Change password", href: "/change-password", icon: KeyRound },
    { label: "Install app", href: "/teacher/dashboard/install", icon: Download },
  ],
  student: [
    { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { label: "Profile", href: "/student/dashboard/profile", icon: User },
    { label: "Courses", href: "/student/dashboard/courses", icon: BookOpen },
    { label: "Library", href: "/student/dashboard/library", icon: Library },
    { label: "Course chat", href: "/student/dashboard/course-chat", icon: MessageCircle },
    { label: "Global chat", href: "/student/dashboard/global-chat", icon: Globe2 },
    { label: "Join quizzes", href: "/student/dashboard/quizzes", icon: Gamepad2 },
    { label: "Book a lesson", href: "/student/dashboard/book-lesson", icon: CalendarPlus },
    { label: "My bookings", href: "/student/dashboard/my-bookings", icon: CalendarPlus },
    { label: "Change password", href: "/change-password", icon: KeyRound },
    { label: "Install app", href: "/student/dashboard/install", icon: Download },
  ],
};

export function AppSidebar({ role: roleOverride }) {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const role = roleOverride || user?.role;
  const navigationItems = navigationItemsByRole[role];

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => navigate("/", { replace: true }));
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sky-100 bg-gradient-to-br from-sky-50 via-white to-emerald-50 px-4 py-5">
        <p className="flex items-center gap-3 text-xl font-bold text-teal-800">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 text-white shadow-lg shadow-sky-200">
            <GraduationCap className="h-7 w-7" />
          </span>
          <span className="leading-tight">Smart Edu Hub</span>
        </p>
      </SidebarHeader>

      <SidebarContent className="bg-white px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-sky-700">
            {role === "admin"
              ? "Admin Area"
              : role === "teacher"
                ? "Teacher Area"
                : "Student Area"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map(({ label, href, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      end={href === `/${role}/dashboard`}
                      to={href}
                      className={
                        location.pathname === href
                          ? "bg-gradient-to-r from-sky-100 to-emerald-50 font-semibold text-teal-800 shadow-sm"
                          : "text-slate-600 hover:bg-sky-50 hover:text-sky-700"
                      }
                    >
                      <Icon />
                      <span>{label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sky-100 bg-sky-50/60 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <ConfirmDialog
              trigger={
                <SidebarMenuButton
                  type="button"
                  className="text-slate-600 hover:bg-rose-50 hover:text-rose-600"
                >
                  <LogOut />
                  <span className="mb-1">Log out</span>
                </SidebarMenuButton>
              }
              title="Log out of your account?"
              description="You will need to sign in again to access your dashboard."
              confirmText="Log out"
              cancelText="Cancel"
              confirmVariant="destructive"
              onConfirm={handleLogout}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
