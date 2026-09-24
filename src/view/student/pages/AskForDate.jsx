import { CalendarWithTime } from "../../../components/calender/CalenderWithTime";
import { ArrowLeft, Mail, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

function BookLessonWithTeacher() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const teacher = state?.teacher;
  const teacherName = `${teacher?.firstName || ""} ${teacher?.secondName || ""}`.trim() || "Teacher";

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-sky-50 via-white to-emerald-50/70 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-5">
        <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-800">
          <ArrowLeft className="h-4 w-4" /> Back to teachers
        </button>
        <section className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-sky-50 text-sky-600">
              {teacher?.photoURL ? <img src={teacher.photoURL} alt={teacherName} className="h-full w-full object-cover" /> : <User className="h-8 w-8" />}
            </div>
            <div>
              <p className="text-sm font-medium text-sky-600">Request a lesson with</p>
              <h1 className="text-2xl font-bold text-teal-800">{teacherName}</h1>
              <p className="mt-1 flex items-center gap-2 text-sm text-slate-500"><Mail className="h-4 w-4" /> {teacher?.email || "No email available"}</p>
            </div>
          </div>
          {teacher?.CV && (
            <div className="mt-5 items-start gap-2 border-t border-slate-100 pt-4">
              <p className="shrink-0 text-xs mb-1 font-semibold uppercase tracking-wide text-sky-600">CV:</p>
              <p className="min-w-0 flex-1 break-words text-sm leading-6 text-slate-600">{teacher.CV}</p>
            </div>
          )}
        </section>
        <CalendarWithTime teacher={teacher} />
      </div>
    </main>
  );
}

export default BookLessonWithTeacher