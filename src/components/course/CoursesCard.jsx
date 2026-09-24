import { auth } from "@/firebase/firebase";
import { ArrowRight, BookOpen, Plus, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { enrollInCourse } from "../../store/slices/courseStudentSlice";
import { SpinnerCustom } from "@/components/ui/spinner";

function CoursesCard({
  title,
  description,
  imageUrl,
  teacherName,
  teacherPhotoURL,
  course,
  teacher,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = auth.currentUser;
  const enrollingCourseId = useSelector(
    (state) => state.courseStudent?.enrollingCourseId,
  );
  const enrolling = enrollingCourseId === course?.id;

  return (
    <article className="group flex min-h-64 flex-col overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl md:flex-row">
      <div className="relative flex h-48 shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br from-sky-100 to-emerald-100 md:h-auto md:w-56">
        {imageUrl ? (
          <img
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            src={imageUrl}
            alt={title}
          />
        ) : (
          <BookOpen className="h-14 w-14 text-sky-500" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h5 className="line-clamp-2 break-words text-xl font-bold tracking-tight text-teal-800 sm:text-2xl">
          {title}
        </h5>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
          {description
            ? `${description.slice(0, 50)}${description.length > 50 ? "..." : ""}`
            : "No course description yet."}
        </p>
        <div className="mt-5 flex items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-sky-400 to-teal-500 font-bold text-white shadow-sm">
            {teacherPhotoURL ? (
              <img
                src={teacherPhotoURL}
                alt={teacherName || "Teacher"}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-4 w-4" />
            )}
          </div>
          <span className="text-sm font-medium text-slate-600">
            {teacherName || "Course teacher"}
          </span>
        </div>
        <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() =>
              navigate(
                `/${teacher ? "teacher" : "student"}/dashboard/courses/read/${course?.id || ""}`,
                {
                  state: { course },
                },
              )
            }
            className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-100"
          >
            Read
            <ArrowRight className="h-4 w-4" />
          </button>
          {teacher ? (
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/teacher/dashboard/courses/add-lessons/${course?.id || ""}`,
                  {
                    state: { course },
                  },
                )
              }
              className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200 bg-white px-4 py-2.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-50 focus:outline-none focus:ring-4 focus:ring-sky-100"
            >
              <Plus className="h-4 w-4" />
              Add lessons
            </button>
          ) : (
            <button
              type="button"
              disabled={enrolling}
              onClick={async () => {
                if (!user?.uid || !course?.id) return;

                try {
                  await dispatch(
                    enrollInCourse({ studentId: user.uid, courseId: course.id }),
                  ).unwrap();

                  navigate("/student/dashboard/courses/enrolled");
                } catch (error) {
                  console.error("Enrollment failed:", error);
                }
              }}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-4 ${
                enrolling
                  ? "cursor-not-allowed border-sky-200 bg-sky-50 text-sky-600"
                  : "border-sky-200 bg-white text-sky-700 hover:bg-sky-50 focus:ring-sky-100"
              }`}
            >
              {enrolling ? (
                <SpinnerCustom />
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Enroll
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default CoursesCard;
