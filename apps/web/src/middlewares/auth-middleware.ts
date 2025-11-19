import { redirect } from "@tanstack/react-router";
import { authService } from "../features/auth/services/auth.service";

const PUBLIC_ROUTES = [
  {
    path: "/auth/login",
    whenAuthenticated: "redirect",
  },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/auth/login";
const REDIRECT_WHEN_AUTHENTICATED_ROUTE = "/app/owner";

export function authMiddleware(context: { location: { pathname: string } }) {
  const pathname = context.location.pathname;
  const publicRoute = PUBLIC_ROUTES.find((route) => route.path === pathname);
  const isPublicRoute = !!publicRoute;
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated && isPublicRoute) {
    console.log("not authenticated and public route");
    return;
  }

  if (!isAuthenticated && !isPublicRoute) {
    console.log("redirecting to not authenticated route");
    throw redirect({
      to: REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE,
    });
  }

  if (
    isAuthenticated &&
    publicRoute &&
    publicRoute.whenAuthenticated === "redirect"
  ) {
    console.log("redirecting to authenticated route");
    throw redirect({
      to: REDIRECT_WHEN_AUTHENTICATED_ROUTE as any,
    });
  }

  if (isAuthenticated && !isPublicRoute) {
    return;
  }

  return;
}
