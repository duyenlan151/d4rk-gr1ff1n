/* eslint-disable react-refresh/only-export-components */
import { Navigate, RouteObject } from "react-router-dom";
import { lazy } from "react";

const Dashboard = lazy(() => import("./dashboard/dashboard.component.tsx"));
const UserManager = lazy(() => import("./user-manager/user-manager.component.tsx"));
const RoleManager = lazy(() => import("./role-manager/role-manager.component.tsx"));

export const routes: RouteObject[] = [
  { path: "dashboard", element: <Dashboard /> },
  { path: "user-manager", element: <UserManager /> },
  { path: "role-manager", element: <RoleManager /> },
  { path: "*", element: <Navigate to="dashboard" relative="route" /> }
];
