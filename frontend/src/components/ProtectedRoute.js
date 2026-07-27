import React from "react";
import { Navigate } from "react-router-dom";
import { getAuthUser, isLoggedIn } from "../utils/auth";

function ProtectedRoute({ children, role }) {
  const user = getAuthUser();

  if (!isLoggedIn()) {
    return <Navigate to="/" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === "admin" ? "/admin-dashboard" : "/dashboard"} replace />;
  }

  return children;
}

export default ProtectedRoute;
