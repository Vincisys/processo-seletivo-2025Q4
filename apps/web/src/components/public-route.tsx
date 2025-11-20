import { Navigate } from "react-router-dom";
import { authUtils } from "@/features/auth/services/auth.service";

interface PublicRouteProps {
  children: React.ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const isAuthenticated = authUtils.isAuthenticated();

  if (isAuthenticated) {
    return <Navigate to="/app/owner" replace />;
  }

  return <>{children}</>;
}

