import { Navigate } from "react-router-dom";
import { authUtils } from "@/features/auth/services/auth.service";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = authUtils.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
}

