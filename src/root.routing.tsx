/* eslint-disable react-refresh/only-export-components */
import { Navigate, RouteObject } from "react-router-dom";
import { lazy } from "react";

import { routes as adminRoutes } from "./modules/admin/admin.routing.tsx";
import { routes as appRoutes } from "./modules/app/app.routing.tsx";


import composedGuard from "./shared/guards/composed.guard.ts";
import authGuard from "./shared/guards/auth.guard.ts";
import noAuthGuard from "./shared/guards/no-auth.guard.ts";
import App from "./modules/app/app.component.tsx";


const Login = lazy(() => import("./modules/auth/login/login.component"));
const SignUp = lazy(() => import("./modules/auth/sign-up/sign-up.component.tsx"));
const Admin = lazy(() => import("./modules/admin/admin.component.tsx"));

// Application's routes
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    errorElement: <Navigate to="/" />,
    children: appRoutes,
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