import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "./routes/root-layout";
import { AppLayout } from "./routes/app-layout";
import { LoginPage } from "./features/auth/pages/login";
import { HomePage } from "./features/home/pages/home";
import { AssetsPage } from "./features/app/assets/pages/assets";
import { OwnerPage } from "./features/app/owners/pages/owner";
import {
  protectedRouteLoader,
  publicRouteLoader,
} from "./middlewares/auth-middleware";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "auth/login",
        element: <LoginPage />,
        loader: publicRouteLoader, // Redireciona se já autenticado
      },
      {
        path: "app",
        element: <AppLayout />,
        loader: protectedRouteLoader, // Protege todas as rotas /app/*
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
