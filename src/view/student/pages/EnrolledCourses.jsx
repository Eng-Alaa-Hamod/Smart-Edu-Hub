import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  GraduationCap,
  Search,
  Trash2,
} from "lucide-react";
import {
  fetchEnrolledCourses,
  unenrollFromCourse,
} from "@/store/slices/courseStudentSlice";
import { Spinner, SpinnerCustom } from "@/components/ui/spinner";
import { useState } from "react";

function EnrolledCourses() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user?.user);
  const {
    enrolledCourses = [],
    loading,
    unenrollingCourseId,
    error,
  } = useSelector((state) => state.courseStudent ?? {});
  const [search, setSearch] = useState("");
  const filteredCourses = enrolledCourses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchEnrolledCourses(user.uid));
    }
  }, [dispatch, user?.uid]);

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-sky-50 via-white to-emerald-50/70">
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 p-6 text-white shadow-xl shadow-sky-100 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-medium text-sky-100">
                <BookMarked className="h-4 w-4" />
                My learning path
              </p>
              <h1 className="text-2xl font-bold sm:text-4xl">
                Enrolled Courses
              </h1>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
              {enrolledCourses.length} course
              {enrolledCourses.length === 1 ? "" : "s"}
            </div>
          </div>
        </section>

        {error && (
          <p className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-600">
            {error}
          </p>
        )}

        <label className="flex items-center gap-3 rounded-2xl border border-sky-100 bg-white px-4 py-3 shadow-sm">
          <Search className="h-5 w-5 text-sky-600" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search enrolled courses..." className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none" />
        </label>

        {loading && filteredCourses.length === 0 ? (
          <div className="rounded-2xl border border-sky-100 bg-white p-8 text-center text-slate-500 shadow-sm">
            <SpinnerCustom className="text-teal-700" />
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {filteredCourses.map((course) => (
              <article
                key={course.id}
                className="group flex min-h-64 flex-col overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl md:flex-row"
              >
                <div className="relative flex h-48 shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br from-sky-100 to-emerald-100 md:h-auto md:w-56">
                  {course.coverUrl ? (
                    <img
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      src={course.coverUrl}
                      alt={course.title}
                    />
                  ) : (
                    <BookOpen className="h-14 w-14 text-sky-500" />
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      Enrolled
                    </span>
                    <span className="text-xs font-medium uppercase tracking-wide text-sky-700">
                      {course.category || "Course"}
                    </span>
                  </div>

                  <h2 className="mt-3 line-clamp-2 text-xl font-bold text-teal-800 sm:text-2xl">
                    {course.title}
                  </h2>

                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                    {course.description.slice(0, 50) +
                      (course.description.length > 50 ? "..." : "") ||
                      "No description available for this course yet."}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-sm text-slate-600">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-teal-500 text-white shadow-sm">
                      {course.teacherPhotoURL ? (
                        <img
                          src={course.teacherPhotoURL}
                          alt={course.teacherName || "Teacher"}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <GraduationCap className="h-4 w-4" />
                      )}
                    </div>
                    <span>{course.teacherName || "Teacher"}</span>
                  </div>

                  <div className="mt-5 pt-4 flex items-center justify-between border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/student/dashboard/courses/read/${course.id}`,
                          {
                            state: { course },
                          },
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-100"
                    >
                      Read course
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled={unenrollingCourseId === course.id}
                      onClick={() => {
                        dispatch(
                          unenrollFromCourse({
                            studentId: user.uid,
                            courseId: course.id,
                          }),
                        );
                      }}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-4 ${
                        unenrollingCourseId === course.id
                          ? "cursor-not-allowed bg-rose-100 text-rose-500"
                          : "bg-rose-50 text-rose-600 hover:bg-rose-100 focus:ring-rose-100"
                      }`}
                    >
                      {unenrollingCourseId === course.id ? (
                        <>
                          <Spinner className="text-rose-500" />
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4" />
                          Unenroll course
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-sky-200 bg-white p-10 text-center shadow-sm">
            <BookMarked className="mx-auto h-12 w-12 text-sky-300" />
            <h2 className="mt-4 text-xl font-bold text-teal-800">
              No enrolled courses yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Browse available courses and join the ones that match your goals.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default EnrolledCourses;
