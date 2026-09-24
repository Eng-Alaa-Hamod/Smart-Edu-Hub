import { useEffect, useState } from "react";
import { MessageCircle, BookOpen, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Chat from "../../../components/chat/Chat";
import { fetchCourseTeacher } from "@/store/slices/CourseTeacherSlice";
import { SpinnerCustom } from "@/components/ui/spinner";

function CourseChate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const user = useSelector((state) => state.user?.user);
  const {
    courseTeacher = [],
    loading,
    error,
  } = useSelector((state) => state.courseTeacher ?? {});
  const [search, setSearch] = useState("");
  const filteredCourses = courseTeacher.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchCourseTeacher(user.uid));
    }
  }, [dispatch, user?.uid]);

  useEffect(() => {
    if (!loading && courseTeacher.length > 0 && !courseId) {
      navigate(`/teacher/dashboard/course-chat/${courseTeacher[0].id}`, {
        replace: true,
      });
    }
  }, [courseId, courseTeacher, loading, navigate]);

  const selectedCourse = courseTeacher.find((course) => course.id === courseId);

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-sky-50 via-white to-emerald-50/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 p-4 sm:p-6 lg:flex-row lg:p-8">
        <section className="w-full rounded-3xl border border-sky-100 bg-white p-4 shadow-sm lg:w-80 lg:shrink-0">
          <div className="mb-4 flex items-center gap-3 border-b border-sky-100 pb-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 text-white">
              <MessageCircle className="h-5 w-5" />
            </span>
            <div>
              <h1 className="font-bold text-teal-800">Course conversations</h1>
              <p className="text-xs text-slate-500">Choose one of your courses</p>
            </div>
          </div>

          {error && (
            <p className="mb-4 rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-600">
              {error}
            </p>
          )}

          {loading && courseTeacher.length === 0 ? (
            <p className="p-4 text-center text-sm text-slate-500">
              <SpinnerCustom className="text-teal-700" />
            </p>
          ) : courseTeacher.length > 0 ? (
            <div className="space-y-2">
              <label className="mb-3 flex items-center gap-2 rounded-xl border border-sky-100 px-3 py-2">
                <Search className="h-4 w-4 text-sky-600" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search conversations..." className="min-w-0 w-full bg-transparent text-sm outline-none" />
              </label>
              {filteredCourses.map((course) => (
                <button
                  key={course.id}
                  type="button"
                  onClick={() =>
                    navigate(`/teacher/dashboard/course-chat/${course.id}`)
                  }
                  className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${
                    selectedCourse?.id === course.id
                      ? "bg-gradient-to-r from-sky-100 to-emerald-50 font-semibold text-teal-800"
                      : "text-slate-600 hover:bg-sky-50"
                  }`}
                >
                  <BookOpen className="h-5 w-5 shrink-0 text-sky-600" />
                  <span className="line-clamp-2">{course.title}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-sky-300" />
              <p className="mt-3 text-sm text-slate-500">
                You have no courses yet.
              </p>
            </div>
          )}
        </section>

        {selectedCourse ? (
          <Chat
            chatId={`course_${selectedCourse.id}`}
            title={selectedCourse.title}
            subtitle="Manage the conversation with your students"
          />
        ) : (
          <section className="flex min-h-[32rem] flex-1 items-center justify-center rounded-3xl border border-sky-100 bg-white p-8 text-center shadow-sm">
            <div>
              <MessageCircle className="mx-auto h-14 w-14 text-sky-300" />
              <h2 className="mt-4 text-xl font-bold text-teal-800">
                Select a course conversation
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Choose one of your courses to open its conversation.
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default CourseChate;
