import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BookOpen, CalendarCheck, Clock3, Users } from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { fetchCourseTeacher, saveCountOfCourses } from "@/store/slices/CourseTeacherSlice";
import { fetchBooksForTeacher } from "@/store/slices/BookLessonSlice";

function HomeTeacher() {
  const dispatch = useDispatch();
  
  const user = useSelector((state) => state.user.user);
  const courses = useSelector((state) => state.courseTeacher?.courseTeacher || []);
  const books = useSelector((state) => state.bookLesson?.books || []);
  const [stats, setStats] = useState({
    lessons: 0,
    students: 0,
    coursesWithLessons: 0,
  });

  const resolvedBookings = books.filter(
    (book) => book.status === "accepted" || book.status === "rejected",
  ).length;

  const courseContentRate = courses.length
    ? (stats.coursesWithLessons / courses.length) * 100
    : 0;
  
    const bookingProgressRate = books.length
    ? (resolvedBookings / books.length) * 100
    : 0;

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchCourseTeacher(user.uid));
      dispatch(fetchBooksForTeacher({ teacherId: user.uid }));
    }
  }, [dispatch, user?.uid]);

  useEffect(() => {

    const loadStats = async () => {
      
      const courseIds = courses.map((course) => course.id);
      if (!courseIds.length) {
        setStats({ lessons: 0, students: 0, coursesWithLessons: 0 });
        return;
      }

      let lessons = 0;
      let coursesWithLessons = 0;
      const students = [];

      for (const courseId of courseIds) {
        
        const lessonsSnapshot = await getDocs(
          collection(db, "courses", courseId, "lessons"),
        );

        const enrollmentsSnapshot = await getDocs(
          query(
            collection(db, "enrollments"),
            where("courseId", "==", courseId),
          ),
        
        );

        lessons += lessonsSnapshot.size;
        if (lessonsSnapshot.size > 0) {
          coursesWithLessons += 1;
        }

        enrollmentsSnapshot.docs.forEach((enrollment) => {
          
          const studentId = enrollment.data().studentId;
          
          if (studentId && !students.includes(studentId)) {
          
            students.push(studentId);

          }
        });
      }

      setStats({
        lessons,
        students: students.length,
        coursesWithLessons,
      });
    };

    loadStats();
  }, [courses]);

  useEffect(() => {
    dispatch(saveCountOfCourses({ count: courses.length , teacherName: `${user?.firstName} ${user?.secondName}`, teacherID: user?.uid }));
  },[dispatch,user,courses])

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-sky-50 via-white to-emerald-50/70">
      <div className="mx-auto max-w-7xl space-y-5 p-3 sm:space-y-6 sm:p-6 lg:p-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 p-6 text-white shadow-xl shadow-sky-100 sm:p-8">
          <div className="max-w-2xl">
            <p className="mb-2 text-sm font-medium text-sky-100">Teacher Workspace</p>
            <h1 className="text-2xl font-bold sm:text-4xl">
              Welcome back, Prof. {user?.firstName}.
            </h1>
            <p className="mt-3 text-sm text-white/85 sm:text-base">
              Manage your courses, interact with students, and track academic progress.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Created Courses", value: courses.length, detail: "Published courses", icon: BookOpen, color: "bg-sky-100 text-sky-700" },
            { label: "Total Lessons", value: stats.lessons, detail: "Across your courses", icon: Clock3, color: "bg-cyan-100 text-cyan-700" },
            { label: "Enrolled Students", value: stats.students, detail: "Unique students", icon: Users, color: "bg-emerald-100 text-emerald-700" },
            { label: "Pending Bookings", value: books.filter((book) => book.status === "pending").length, detail: "Requires response", icon: CalendarCheck, color: "bg-lime-100 text-lime-700" },
          ].map(({ label, value, detail, icon: Icon, color }) => (
            <div key={label} className="rounded-2xl border border-sky-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-5">
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-sm text-slate-500">{label}</p>
              <div className="mt-1 flex items-end justify-between gap-2">
                <p className="text-2xl font-bold text-slate-800">{value}</p>
                <p className="text-xs text-slate-400">{detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,1fr)]">
          <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-teal-800">Course Content Coverage</h3>
                <p className="mt-1 text-sm text-slate-500">Courses that already contain at least one lesson.</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {courseContentRate.toFixed(0)}%
              </span>
            </div>
            <div className="mt-6 h-3 overflow-hidden rounded-full bg-sky-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-[width] duration-500"
                style={{ width: `${courseContentRate}%` }}
              />
            </div>
            <div className="mt-3 flex justify-between text-sm text-slate-500">
              <span>{stats.coursesWithLessons}/{courses.length} courses with lessons</span>
              <span>{courses.length - stats.coursesWithLessons} without content</span>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-xl font-bold text-teal-800">Booking Requests</h3>
            <p className="mt-1 text-sm text-slate-500">Track requests that still need a response.</p>
            <div className="mt-5 space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-600">Requests handled</span>
                  <span className="font-semibold text-emerald-600">
                    {resolvedBookings}/{books.length}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-emerald-100">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-[width] duration-500"
                    style={{ width: `${bookingProgressRate}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-600">Awaiting response</span>
                  <span className="font-semibold text-sky-600">
                    {books.filter((book) => book.status === "pending").length}/{books.length}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-sky-100">
                  <div
                    className="h-full rounded-full bg-sky-500 transition-[width] duration-500"
                    style={{
                      width: `${books.length ? (books.filter((book) => book.status === "pending").length / books.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeTeacher;