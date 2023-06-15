/* eslint-disable react-refresh/only-export-components */
import { Navigate, RouteObject } from "react-router-dom";
import { lazy } from "react";

// Routes
import { routes as commissionRoutes } from "./commission/commission.routing";

// Guards
import authGuard from "../../shared/guards/auth.guard.ts";

// Eager components
import Landing from "./home/landing.component.tsx";

// Lazy components
const Commission = lazy(() => import("./commission/commission.component"));

export const routes: RouteObject[] = [
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
  { path: "*", element: <Navigate to="" relative="route" /> },
];
