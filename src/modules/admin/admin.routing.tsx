/* eslint-disable react-refresh/only-export-components */
import { Navigate, RouteObject } from "react-router-dom";
import { lazy } from "react";

const Dashboard = lazy(() => import("./dashboard/dashboard.component.tsx"));

export const routes: RouteObject[] = [
  { path: "dashboard", element: <Dashboard /> },
  { path: "*", element: <Navigate to="dashboard" relative="route" /> }
];
