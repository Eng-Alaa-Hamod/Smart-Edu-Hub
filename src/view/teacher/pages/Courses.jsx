import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BookOpen, Plus, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CoursesCard from "../../../components/course/CoursesCard";
import { fetchCourseTeacher } from "@/store/slices/CourseTeacherSlice";
import { SpinnerCustom } from "@/components/ui/spinner";

function Courses() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const user = useSelector((state) => state.user.user);
  const {
    courseTeacher = [],
    loading,
    error,
  } = useSelector((state) => state.courseTeacher ?? {});
  const filteredCourses = courseTeacher.filter((course) =>
    `${course.title}`.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchCourseTeacher(user.uid));
    }
  }, [dispatch, user?.uid]);

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-sky-50 via-white to-emerald-50/70">
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        <section className="flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 p-6 text-white shadow-xl shadow-sky-100 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-medium text-sky-100">
              <BookOpen className="h-4 w-4" />
              Teacher Workspace
            </p>
            <h1 className="text-2xl font-bold sm:text-4xl">My Courses</h1>
            <p className="mt-2 text-sm text-white/85 sm:text-base">
              Create, organize, and share your courses with your students.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/teacher/dashboard/courses/add")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold text-teal-700 shadow-md transition hover:bg-sky-50 focus:outline-none focus:ring-4 focus:ring-white/40"
          >
            <Plus className="h-5 w-5" />
            Add Course
          </button>
        </section>

        {error && <p className="mt-5 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <label className="flex items-center gap-3 rounded-2xl border border-sky-100 bg-white px-4 py-3 shadow-sm">
          <Search className="h-5 w-5 text-sky-600" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search courses by title..." className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none" />
        </label>

        {loading && filteredCourses.length === 0 ? (
          <div className="rounded-2xl border border-sky-100 bg-white p-8 text-center text-slate-500 shadow-sm">
            <SpinnerCustom className="text-teal-700" />
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {filteredCourses.map((course) => (
              <CoursesCard
                key={course.id}
                title={course.title}
                description={course.description}
                imageUrl={course.coverUrl || course.imageUrl}
                teacherName={course.teacherName}
                teacherPhotoURL={course.teacherPhotoURL}
                course={course}
                teacher={true}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-sky-200 bg-white p-10 text-center shadow-sm">
            <BookOpen className="mx-auto h-12 w-12 text-sky-300" />
            <h2 className="mt-4 text-xl font-bold text-teal-800">No courses yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Start building your teaching space by adding your first course.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default Courses;
