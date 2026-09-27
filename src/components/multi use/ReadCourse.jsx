import { useEffect, useState } from "react";
import { BookOpen, FileText, Search, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { deleteCourseWithLessons } from "@/store/slices/CourseTeacherSlice";
import {
  deleteLesson,
  fetchLessonsByCourse,
} from "@/store/slices/LessonTeacherSlice";
import { SpinnerCustom } from "@/components/ui/spinner";
import { ConfirmDialog } from "@/components/multi use/ConfirmDialog";
import { EmptyState, ErrorState, LoadingState } from "./ContentState";

function ReadCourse({ teacher, admin = false }) {
  const { courseId } = useParams();
  const { state } = useLocation();
  const course = state?.course;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const lessons = useSelector((store) => store.lessons?.lessons || []);
  const lessonsLoading = useSelector((store) => store.lessons?.loading);
  const lessonsError = useSelector((store) => store.lessons?.error);
  const deletingLessonId = useSelector(
    (store) => store.lessons?.deletingLessonId,
  );
  const deletingCourseId = useSelector(
    (store) => store.courseTeacher?.deletingCourseId,
  );
  const [selectedId, setSelectedId] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchLessonsByCourse(courseId));
  }, [dispatch, courseId]);

  const selected =
    lessons.find((lesson) => lesson.id === selectedId) || lessons[0];
  const filteredLessons = lessons.filter((lesson) =>
    lesson.title.toLowerCase().includes(search.toLowerCase()),
  );

  const removeCourse = async () => {
    await dispatch(
      deleteCourseWithLessons({ courseId, coverUrl: course?.coverUrl }),
    ).unwrap();
    navigate(admin ? "/admin/dashboard/courses" : "/teacher/dashboard/courses", { replace: true });
  };

  const removeLesson = async () => {
    if (!selected) return;
    await dispatch(deleteLesson({ courseId, lessonId: selected.id })).unwrap();
    setSelectedId("");
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-5 flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <h1 className="min-w-0 break-words flex-1 items-center gap-2 text-xl font-bold text-teal-800">
            <BookOpen className="h-5 w-5" /> {course?.title || "Course"}
          </h1>
          {teacher || admin ? (
            <ConfirmDialog
              trigger={<button type="button" disabled={deletingCourseId === courseId} className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600">{deletingCourseId === courseId ? <SpinnerCustom inline spinnerClassName="text-rose-600"  /> : <Trash2 className="h-4 w-4" />} Delete course</button>}
              title="Delete this course and all its lessons?"
              description="The course, lessons, and uploaded files will be permanently removed."
              confirmText="Delete course"
              cancelText="Cancel"
              confirmVariant="destructive"
              onConfirm={removeCourse}
            />
          ) : null}
        </header>
        {course?.description && (
          <section className="mb-5 rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
              Course description
            </p>
            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
              {course.description}
            </p>
          </section>
        )}
        <div className="grid min-h-[70vh] gap-4 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-2xl bg-white p-3 shadow-sm">
            <h2 className="border-b border-slate-100 p-3 font-bold text-slate-700">
              Lessons
            </h2>
            <label className="mt-3 flex items-center gap-2 rounded-xl border border-sky-100 px-3 py-2">
              <Search className="h-4 w-4 text-sky-600" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search lessons..." className="min-w-0 w-full bg-transparent text-sm outline-none" />
            </label>
            {lessonsLoading ? (
              <LoadingState label="Loading lessons..." />
            ) : lessonsError ? (
              <ErrorState message={lessonsError} />
            ) : filteredLessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => setSelectedId(lesson.id)}
                className={`mt-2 flex w-full items-center gap-2 rounded-xl p-3 text-left text-sm ${selected?.id === lesson.id ? "bg-sky-100 font-semibold text-teal-800" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <span>{lesson.order}.</span>
                  <span className="break-words">{lesson.title}</span>
              </button>
            ))}
            {!lessonsLoading && !lessonsError && !filteredLessons.length && (
              <EmptyState message="No lessons match your search." />
            )}
          </aside>
          <section className="relative min-w-0 rounded-2xl bg-white p-4 shadow-sm">
            {selected ? (
              <>
                <div className="mb-3 flex min-w-0 items-start justify-between gap-3">
                  <h2 className="min-w-0 break-words font-bold text-teal-800">
                    <FileText className="h-5 w-5" /> {selected.title}
                  </h2>
                  {teacher || admin ? (
                    <ConfirmDialog
                      trigger={<button type="button" disabled={deletingLessonId === selected.id} className="rounded-xl bg-rose-50 p-2 text-rose-600" title="Delete lesson">{deletingLessonId === selected.id ? <SpinnerCustom inline spinnerClassName="text-rose-600"  /> : <Trash2 className="h-4 w-4" />}</button>}
                      title="Delete this lesson?"
                      description="The lesson and its uploaded PDF will be permanently removed."
                      confirmText="Delete lesson"
                      cancelText="Cancel"
                      confirmVariant="destructive"
                      onConfirm={removeLesson}
                    />
                  ) : null}
                </div>
                {selected.description && (
                  <p className="mb-4 whitespace-pre-wrap break-words rounded-xl bg-sky-50 p-4 text-sm leading-6 text-slate-600">
                    {selected.description}
                  </p>
                )}
                <iframe
                  src={selected.pdfUrl}
                  title={selected.title}
                  className="h-[62vh] w-full rounded-xl border border-slate-200"
                />
              </>
            ) : (
              <p className="flex h-full items-center justify-center text-slate-400">
                Choose a lesson to read.
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default ReadCourse;
