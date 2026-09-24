import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/multi use/app-sidebar";
import ProfileTopBar from "@/components/multi use/ProfileTopBar";
import { Outlet } from "react-router-dom";

function TeacherDashboard() {
  return (
    <SidebarProvider>
      <AppSidebar role="teacher" />
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-16 items-center border-b border-sky-100 bg-white/95 px-3 shadow-sm backdrop-blur sm:h-20 sm:px-6">
          <SidebarTrigger />
          <span className="flex-grow" />
          <span className="mr-0 sm:mr-2">
            <ProfileTopBar role="teacher" />
          </span>
        </header>

        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default TeacherDashboard;