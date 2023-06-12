/* eslint-disable react-refresh/only-export-components */
import { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { routes as commissionRoutes } from "./modules/commission/commission.routing";

import App from "./app.component";
import Landing from "./modules/home/landing.component";

// Guards
import authGuard from "./shared/guards/auth.guard";
import noAuthGuard from "./shared/guards/no-auth.guard";

// Lazy loaded components
const Login = lazy(() => import("./modules/auth/login/login.component"));

// Application's routes
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Landing />,
      },
      {
        path: "commission",
        children: commissionRoutes,
        loader: authGuard,
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
    loader: noAuthGuard
  },
];
