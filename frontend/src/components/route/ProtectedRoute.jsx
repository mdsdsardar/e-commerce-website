import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useEffect } from "react";
import Loader from "../layout/Loader";

const ProtectedRoute = ({ isAdmin = false }) => {
  const { isAuthenticated, loading, userLoaded, user } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (userLoaded && !isAuthenticated) {
      toast.error("LOGIN FIRST TO ACCESS THIS RESOURCES.");
    } else if (
      userLoaded &&
      isAuthenticated &&
      isAdmin &&
      user?.role !== "admin"
    ) {
      toast.error("ACCESS DENIED. ADMIN PRIVILEGES REQUIRED.");
    }
  }, [userLoaded, isAuthenticated, isAdmin, user]);

  // Show loading while checking authentication
  if (!userLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader />
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Check if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if admin route but user is not admin
  if (isAdmin && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
