
import { useEffect, useState } from "react";
import { BookOpen, Search, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog } from "@/components/multi use/ConfirmDialog";
import { SpinnerCustom } from "@/components/ui/spinner";
import { deleteCourseWithLessons } from "@/store/slices/CourseTeacherSlice";
import { fetchAllCourses } from "@/store/slices/adminSlice";

function Courses() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { courses = [], loading, error } = useSelector((state) => state.admin);
  const { deletingCourseId } = useSelector((state) => state.courseTeacher);
  const filteredCourses = courses.filter((course) =>
    `${course.title} ${course.teacherName || ""}`.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    dispatch(fetchAllCourses());
  }, [dispatch]);

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-slate-50/70 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="rounded-2xl bg-gradient-to-r from-sky-600 to-teal-600 p-6 text-white shadow-lg">
          <p className="flex items-center gap-2 text-sm text-sky-100"><BookOpen className="h-4 w-4" /> Admin workspace</p>
          <h1 className="mt-2 text-3xl font-bold">All courses</h1>
          <p className="mt-2 text-sm text-white/80">Read course lessons or remove a course and its uploaded files.</p>
        </header>
        <label className="flex items-center gap-3 rounded-2xl border border-sky-100 bg-white px-4 py-3 shadow-sm">
          <Search className="h-5 w-5 text-sky-600" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search courses..." className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
        </label>
        {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        {loading && !courses.length ? <div className="flex justify-center rounded-2xl bg-white p-10"><SpinnerCustom className="text-teal-700" /></div> : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredCourses.map((course) => (
              <article key={course.id} className="overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">
                {course.coverUrl && <img src={course.coverUrl} alt={course.title} className="h-40 w-full object-cover" />}
                <div className="p-5">
                  <h2 className="text-xl font-bold text-teal-800">{course.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">By {course.teacherName || "Unknown teacher"}</p>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{course.description || "No description yet."}</p>
                  <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                    <button type="button" onClick={() => navigate(`/admin/dashboard/courses/read/${course.id}`, { state: { course } })} className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700">Read course</button>
                    <ConfirmDialog
                      trigger={<button type="button" disabled={deletingCourseId === course.id} className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-100">{deletingCourseId === course.id ? <SpinnerCustom inline spinnerClassName="text-rose-600"  /> : <Trash2 className="h-4 w-4" />} Delete</button>}
                      title="Delete this course and all lessons?"
                      description="The course, lessons, and uploaded files will be permanently removed."
                      confirmText="Delete course"
                      cancelText="Cancel"
                      confirmVariant="destructive"
                      onConfirm={async () => {
                        await dispatch(deleteCourseWithLessons({ courseId: course.id, coverUrl: course.coverUrl })).unwrap();
                        dispatch(fetchAllCourses());
                      }}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        {!loading && !filteredCourses.length && <p className="rounded-2xl bg-white p-10 text-center text-slate-500">No courses found.</p>}
      </div>
    </main>
  );
}

export default Courses
