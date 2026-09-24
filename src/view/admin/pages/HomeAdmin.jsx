import { lazy, Suspense, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { BookOpen, CalendarCheck, GraduationCap, UsersRound } from "lucide-react";
import { db } from "@/firebase/firebase";
import { AdminChartCard, AdminPageHeader } from "../components/AdminChartCard";
import { SpinnerCustom } from "@/components/ui/spinner";

const EnrollmentsLast7daysData = lazy(() => import("../charts/line/enrollments last 7 days/EnrollmentsLast7daysData"));
const RoleUsersData = lazy(() => import("../charts/pie/role/RoleUsersData"));
const BookingStatusData = lazy(() => import("../charts/pie/books/BookingStatusData"));
const StudentsRatesData = lazy(() => import("../charts/bar/student's rates/StudentsRatesData"));

function HomeAdmin() {
  const [totals, setTotals] = useState({
    students: 0,
    teachers: 0,
    courses: 0,
    bookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const [usersSnapshot, coursesSnapshot, bookingsSnapshot] = await Promise.all([
          getDocs(collection(db, "users")),
          getDocs(collection(db, "courses")),
          getDocs(collection(db, "bookings")),
        ]);
        const users = usersSnapshot.docs.map((user) => user.data());

        setTotals({
          students: users.filter((user) => user.role === "student").length,
          teachers: users.filter((user) => user.role === "teacher").length,
          courses: coursesSnapshot.size,
          bookings: bookingsSnapshot.size,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTotals();
  }, []);

  const summaryCards = [
    { label: "Total students", value: totals.students, icon: UsersRound, color: "bg-sky-100 text-sky-700" },
    { label: "Total teachers", value: totals.teachers, icon: GraduationCap, color: "bg-teal-100 text-teal-700" },
    { label: "Total courses", value: totals.courses, icon: BookOpen, color: "bg-amber-100 text-amber-700" },
    { label: "Total bookings", value: totals.bookings, icon: CalendarCheck, color: "bg-rose-100 text-rose-700" },
  ];

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-slate-50/70 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <AdminPageHeader
          eyebrow="Smart Edu Hub"
          title="Admin dashboard"
          description="A focused overview of platform activity, learning demand, and student engagement."
          color="sky"
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map(({ label, value, icon: Icon, color }) => (
            <section key={label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-900">{loading ? "-" : value}</p>
              <p className="mt-1 text-xs text-slate-400">Live platform total</p>
            </section>
          ))}
        </div>

        <Suspense fallback={<div className="rounded-2xl border border-sky-100 bg-white p-8 text-center text-sm text-slate-500"><SpinnerCustom /></div>}>
          <div className="grid gap-5 xl:grid-cols-2">
          <AdminChartCard title="New enrollments" description="Course enrollments during the last 30 days." accent="teal">
            <EnrollmentsLast7daysData days={30} />
          </AdminChartCard>
          <AdminChartCard title="Students and teachers" description="The balance of platform users by role." accent="amber">
            <RoleUsersData />
          </AdminChartCard>
          <AdminChartCard title="Booking statuses" description="A snapshot of current booking request states." accent="rose">
            <BookingStatusData />
          </AdminChartCard>
          <AdminChartCard title="Best game students" description="The students with the strongest achievement rates." accent="teal">
            <StudentsRatesData />
          </AdminChartCard>
          </div>
        </Suspense>
      </div>
    </main>
  );
}

export default HomeAdmin;
