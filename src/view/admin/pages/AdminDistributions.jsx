import RoleUsersData from "../charts/pie/role/RoleUsersData";
import DisableUsersData from "../charts/pie/disable/DisableUsersData";
import BookingStatusData from "../charts/pie/books/BookingStatusData";
import BadgeMedalsData from "../charts/pie/badges/BadgeMedalsData";
import { AdminChartCard, AdminPageHeader } from "../components/AdminChartCard";

function AdminDistributions() {
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-slate-50/70 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <AdminPageHeader eyebrow="Admin analytics" title="Distributions" description="Understand how users, account states, bookings, and achievements are distributed across the platform." color="sky" />
        <div className="grid gap-5 lg:grid-cols-2">
          <AdminChartCard title="Users by role" description="Compare students, teachers, and administrators." accent="sky"><RoleUsersData /></AdminChartCard>
          <AdminChartCard title="Account status" description="Active and disabled user accounts." accent="teal"><DisableUsersData /></AdminChartCard>
          <AdminChartCard title="Booking status" description="Current booking requests by status." accent="amber"><BookingStatusData /></AdminChartCard>
          <AdminChartCard title="Achievement medals" description="The balance of gold, silver, and bronze medals." accent="rose"><BadgeMedalsData /></AdminChartCard>
        </div>
      </div>
    </main>
  );
}

export default AdminDistributions;