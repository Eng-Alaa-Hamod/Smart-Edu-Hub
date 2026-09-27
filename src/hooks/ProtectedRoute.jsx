import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ children, role }) {
  const location = useLocation();
  const user = useSelector((state) => state.user.user);

  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (!user.emailVerified) {
    return <Navigate to="/verify-email" replace state={{ from: location }} />;
  }

  if (role && user.role !== role) {
    return (
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
    );
  }

  return children;
}

export default ProtectedRoute;
