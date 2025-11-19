import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "./routes/root-layout";
import { AppLayout } from "./routes/app-layout";
import { ProtectedRoute } from "./components/protected-route";
import { PublicRoute } from "./components/public-route";
import { LoginPage } from "./features/auth/pages/login";
import { HomePage } from "./features/home/pages/home";
import { AssetsPage } from "./features/app/assets/pages/assets";
import { OwnerPage } from "./features/app/owners/pages/owner";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "auth/login",
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: "app",
        element: (
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/app/owner" replace />,
          },
          {
            path: "owner",
            element: <OwnerPage />,
          },
          {
            path: "assets",
            element: <AssetsPage />,
          },
        ],
      },
    ],
  },
]);
