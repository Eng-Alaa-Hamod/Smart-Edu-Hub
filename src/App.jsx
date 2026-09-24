import { lazy, Suspense } from "react";

import { Navigate, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./auth/Login";
import ProtectedRoute from "./hooks/ProtectedRoute";
import { useUserListener } from "./hooks/useUserListener";
import { SpinnerCustom } from "./components/ui/spinner";
import SignUp from "./auth/SignUp";

const ForgotPassword = lazy(() => import("./auth/ForgotPassword"));
const StudentDashboard = lazy(() => import("./view/student/dashboard"));
const TeacherDashboard = lazy(() => import("./view/teacher/dashbaord"));
const AdminDashboard = lazy(() => import("./view/admin/AdminDashboard"));
const ChangePassword = lazy(() => import("./auth/ChangePassword"));
const InstallApp = lazy(() => import("./view/InstallApp"));
const VerifyEmail = lazy(() => import("./auth/VerifyEmail"));
const HomeStudent = lazy(() => import("./view/student/pages/HomeStudent"));
const StudentCourses = lazy(() => import("./view/student/pages/Courses"));
const Library = lazy(() => import("./view/student/pages/Library"));
const ProfileStudents = lazy(() => import("./view/student/pages/ProfileStudents"));
const CourseChat = lazy(() => import("./view/student/pages/CourseChat"));
const StudentGlobalChat = lazy(
  () => import("./view/student/pages/StudentGlobalChat"),
);
const QuizGameAvailable = lazy(
  () => import("./view/student/pages/QuizGameAvailable"),
);
const BookLessonWithTeacher = lazy(
  () => import("./view/student/pages/BookLessonWithTeacher"),
);
const MyBooking = lazy(() => import("./view/student/pages/MyBooking"));
const AskForDate = lazy(() => import("./view/student/pages/AskForDate"));
const HomeTeacher = lazy(() => import("./view/teacher/pages/HomeTeacher"));
const TeacherCourses = lazy(() => import("./view/teacher/pages/Courses"));
const AddCourse = lazy(() => import("./view/teacher/pages/AddCourse"));
const AddLesson = lazy(() => import("./view/teacher/pages/AddLesson"));
const TeacherLibrary = lazy(() => import("./view/teacher/pages/Library"));
const TeacherCourseChat = lazy(() => import("./view/teacher/pages/CourseChate"));
const TeacherGlobalChat = lazy(
  () => import("./view/teacher/pages/TeacherGlobalChat"),
);
const ManageQuizzes = lazy(() => import("./view/teacher/pages/ManageQuizzes"));
const BookingRequests = lazy(() => import("./view/teacher/pages/BookingRequests"));
const ProfileTeacher = lazy(() => import("./view/teacher/pages/ProfileTeacher"));
const ReadCourseStudents = lazy(
  () => import("./view/student/pages/ReadCourseStudents"),
);
const ReadCourseTeacher = lazy(() => import("./view/teacher/pages/ReadCourse"));
const EnrolledCourses = lazy(() => import("./view/student/pages/EnrolledCourses"));
const LibraryPdfReader = lazy(() => import("./components/library/LibraryPdfReader"));
const NotFound = lazy(() => import("./Error/NotFound"));
const HomeAdmin = lazy(() => import("./view/admin/pages/HomeAdmin"));
const ProfileAdmin = lazy(() => import("./view/admin/pages/ProfileAdmin"));
const Users = lazy(() => import("./view/admin/pages/Users"));
const Teachers = lazy(() => import("./view/admin/pages/Teachers"));
const Students = lazy(() => import("./view/admin/pages/Students"));
const Courses = lazy(() => import("./view/admin/pages/Courses"));
const AdminLibrary = lazy(() => import("./view/admin/pages/Library"));
const AdminChats = lazy(() => import("./view/admin/pages/Chats"));
const AdminReadCourse = lazy(() => import("./view/admin/pages/ReadCourse"));
const StudentAchievements = lazy(() => import("./view/admin/pages/StudentAchievements"));
const AdminBookings = lazy(() => import("./view/admin/pages/Bookings"));
const AdminDistributions = lazy(() => import("./view/admin/pages/AdminDistributions"));
const AdminComparisons = lazy(() => import("./view/admin/pages/AdminComparisons"));
const AdminTrends = lazy(() => import("./view/admin/pages/AdminTrends"));

function App() {
  useUserListener();
  const user = useSelector((state) => state.user.user);

  return (
    <Suspense
      fallback={
        <SpinnerCustom className="min-h-screen text-teal-700 [&>svg]:size-9" />
      }
    >
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate
                to={
                  user.role === "admin"
                    ? "/admin/dashboard"
                    : user.role === "teacher"
                      ? "/teacher/dashboard"
                      : "/student/dashboard"
                }
                replace
              />
            ) : (
              <Login />
            )
          }
        />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomeStudent />} />
          <Route path="courses" element={<StudentCourses />} />
          <Route
            path="courses/read/:courseId"
            element={<ReadCourseStudents />}
          />
          <Route path="courses/enrolled" element={<EnrolledCourses />} />
          <Route path="library" element={<Library />} />
          <Route path="library/read/:pdfId" element={<LibraryPdfReader />} />
          <Route path="profile" element={<ProfileStudents />} />
          <Route path="install" element={<InstallApp />} />
          <Route path="course-chat" element={<CourseChat />} />
          <Route path="course-chat/:courseId" element={<CourseChat />} />
          <Route path="global-chat" element={<StudentGlobalChat />} />
          <Route path="quizzes" element={<QuizGameAvailable />} />
          <Route path="book-lesson" element={<BookLessonWithTeacher />} />
          <Route path="my-bookings" element={<MyBooking />} />
          <Route path="ask-for-date" element={<AskForDate />} />
        </Route>
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute role="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomeTeacher />} />
          <Route path="courses" element={<TeacherCourses />} />
          <Route path="courses/add" element={<AddCourse />} />
          <Route path="courses/add-lessons/:courseId" element={<AddLesson />} />
          <Route
            path="courses/read/:courseId"
            element={<ReadCourseTeacher />}
          />
          <Route path="library" element={<TeacherLibrary />} />
          <Route path="library/read/:pdfId" element={<LibraryPdfReader />} />
          <Route path="course-chat" element={<TeacherCourseChat />} />
          <Route path="course-chat/:courseId" element={<TeacherCourseChat />} />
          <Route path="global-chat" element={<TeacherGlobalChat />} />
          <Route path="quizzes" element={<ManageQuizzes />} />
          <Route path="bookings" element={<BookingRequests />} />
          <Route path="profile" element={<ProfileTeacher />} />
          <Route path="install" element={<InstallApp />} />
        </Route>

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomeAdmin />} />
          <Route path="profile" element={<ProfileAdmin />} />
          <Route path="install" element={<InstallApp />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="students" element={<Students />} />
          <Route path="student-achievements" element={<StudentAchievements />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/read/:courseId" element={<AdminReadCourse />} />
          <Route path="library" element={<AdminLibrary />} />
          <Route path="library/read/:pdfId" element={<LibraryPdfReader />} />
          <Route path="chats" element={<AdminChats />} />
          <Route path="users" element={<Users />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="charts/distributions" element={<AdminDistributions />} />
          <Route path="charts/comparisons" element={<AdminComparisons />} />
          <Route path="charts/trends" element={<AdminTrends />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
