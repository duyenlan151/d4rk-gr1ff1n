/* eslint-disable react-refresh/only-export-components */
import { Navigate, RouteObject } from "react-router-dom";
import { lazy } from "react";

// Routes
import { routes as commissionRoutes } from "./modules/commission/commission.routing";
import { routes as adminRoutes } from "./modules/admin/admin.routing.tsx";

import Landing from "./modules/home/landing.component";
import App from "./app.component";

// Guards
import noAuthGuard from "./shared/guards/no-auth.guard";
import authGuard from "./shared/guards/auth.guard";
import composedGuard from "./shared/guards/composed.guard.ts";

// Lazy loaded components
const Login = lazy(() => import("./modules/auth/login/login.component"));
const SignUp = lazy(() => import("./modules/auth/sign-up/sign-up.component.tsx"));
const Commission = lazy(() => import("./modules/commission/commission.component"));
const Admin = lazy(() => import("./modules/admin/admin.component.tsx"));

// Application's routes
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    errorElement: <Navigate to="/" />,
    children: [
      {
        path: "",
        element: <Landing />,
      },
      {
        path: "commission",
        element: <Commission />,
        children: commissionRoutes,
        loader: authGuard,
      },
    ],
  },
  {
    path: "admin",
    element: <Admin />,
    children: adminRoutes,
    loader: composedGuard(authGuard),
  },
  {
    path: "login",
    element: <Login />,
    loader: noAuthGuard,
  },
  {
    path: "sign-up",
    element: <SignUp />,
    loader: noAuthGuard,
  },
];
