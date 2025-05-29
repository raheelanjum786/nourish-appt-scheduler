import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = () => {
  const { user } = useAuth();

  return user?.role === "ADMIN" ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;
