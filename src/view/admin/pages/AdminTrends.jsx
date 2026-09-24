import UsersSignLast7daysData from "../charts/line/users last 7 days/UsersSignLast7daysData";
import EnrollmentsLast7daysData from "../charts/line/enrollments last 7 days/EnrollmentsLast7daysData";
import BookingsCreatedLast7daysData from "../charts/line/booking created at/BookingsCreatedLast7daysData";
import BookingsDateLast7daysData from "../charts/line/booking date/BookingsDateLast7daysData";
import GamesUpdatedLast7daysData from "../charts/line/games updated at/GamesUpdatedLast7daysData";
import { AdminChartCard, AdminPageHeader } from "../components/AdminChartCard";

function AdminTrends() {
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-slate-50/70 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <AdminPageHeader eyebrow="Admin analytics" title="Trends over time" description="Track the daily movement of users, enrollments, bookings, sessions, and game results." color="teal" />
        <div className="grid gap-5 xl:grid-cols-2">
          <AdminChartCard title="New users" description="User registrations during the last seven days." accent="teal"><UsersSignLast7daysData /></AdminChartCard>
          <AdminChartCard title="Course enrollments" description="New course enrollments during the last seven days." accent="sky"><EnrollmentsLast7daysData /></AdminChartCard>
          <AdminChartCard title="Created bookings" description="Bookings created during the last seven days." accent="sky"><BookingsCreatedLast7daysData /></AdminChartCard>
          <AdminChartCard title="Scheduled sessions" description="Bookings grouped by their session date." accent="amber"><BookingsDateLast7daysData /></AdminChartCard>
          <AdminChartCard title="Game results" description="Game achievements updated during the last seven days." accent="rose"><GamesUpdatedLast7daysData /></AdminChartCard>
        </div>
      </div>
    </main>
  );
}

export default AdminTrends;