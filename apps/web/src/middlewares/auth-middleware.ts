import { redirect } from "react-router-dom";
import { authUtils } from "../features/auth/utils/auth-utils";

const PUBLIC_ROUTES = ["/auth/login", "/"] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/auth/login";
const REDIRECT_WHEN_AUTHENTICATED_ROUTE = "/app/owner";

export function protectedRouteLoader() {
  const isAuthenticated = authUtils.isAuthenticated();

  if (!isAuthenticated) {
    throw redirect(REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE);
  }

  return null;
}

export function publicRouteLoader() {
  const isAuthenticated = authUtils.isAuthenticated();

  if (isAuthenticated) {
    throw redirect(REDIRECT_WHEN_AUTHENTICATED_ROUTE);
  }

  return null;
}
