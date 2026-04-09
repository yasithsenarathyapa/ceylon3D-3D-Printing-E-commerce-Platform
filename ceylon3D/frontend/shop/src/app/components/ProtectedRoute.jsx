import { Navigate, useLocation } from "react-router";

export function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");
  const authUserStr = localStorage.getItem("authUser");
  const location = useLocation();

  if (!token || !authUserStr) {
    // Not logged in, redirect to login page (MyAccount)
    return <Navigate to="/account" state={{ from: location }} replace />;
  }

  if (adminOnly) {
    try {
      const user = JSON.parse(authUserStr);
      if (!user.roles || !user.roles.includes("ROLE_ADMIN")) {
        return <Navigate to="/" replace />;
      }
    } catch {
      return <Navigate to="/account" replace />;
    }
  }

  return children;
}
