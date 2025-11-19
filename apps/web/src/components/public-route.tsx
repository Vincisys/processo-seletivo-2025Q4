import { Navigate } from "react-router-dom";
import { authService } from "@/features/auth/services/auth.service";

interface PublicRouteProps {
  children: React.ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const isAuthenticated = authService.isAuthenticated();

  if (isAuthenticated) {
    return <Navigate to="/app/owner" replace />;
  }

  return <>{children}</>;
}

