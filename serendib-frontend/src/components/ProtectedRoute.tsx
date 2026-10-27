import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { getAdminToken } from "../api/auth";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const token = getAdminToken();

  if (!token) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  return children;
}