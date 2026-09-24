import TeacherCoursesData from "../charts/bar/teacher's courses/TeacherCoursesData";
import StudentsRatesData from "../charts/bar/student's rates/StudentsRatesData";
import { AdminChartCard, AdminPageHeader } from "../components/AdminChartCard";

function AdminComparisons() {
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-slate-50/70 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <AdminPageHeader eyebrow="Admin analytics" title="Comparisons" description="Compare course popularity, teacher activity, and student game performance at a glance." color="amber" />
        <div className="grid gap-5 lg:grid-cols-2">
          <AdminChartCard title="Courses by teacher" description="How many courses are managed by each teacher." accent="sky"><TeacherCoursesData /></AdminChartCard>
          <AdminChartCard title="Top student rates" description="The five highest student achievement rates." accent="amber"><StudentsRatesData /></AdminChartCard>
        </div>
      </div>
    </main>
  );
}

export default AdminComparisons;