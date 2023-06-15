/* eslint-disable react-refresh/only-export-components */
import { Navigate, RouteObject } from "react-router-dom";
import { AppPermission } from "../../shared/constants.enum.ts";
import { lazy } from "react";

// Guards
import composedGuard from "../../shared/guards/composed.guard.ts";
import authGuard from "../../shared/guards/auth.guard.ts";
import permissionGuard from "../../shared/guards/permission.guard.ts";

const Dashboard = lazy(() => import("./dashboard/dashboard.component.tsx"));
const UserManager = lazy(() => import("./user-manager/user-manager.component.tsx"));
const RoleManager = lazy(() => import("./role-manager/role-manager.component.tsx"));

export const routes: RouteObject[] = [
  {
    path: "dashboard",
    element: <Dashboard />,
    loader: composedGuard(authGuard),
  },
  {
    path: "user-manager",
    element: <UserManager />,
    loader: composedGuard(authGuard, permissionGuard(AppPermission.USER_READ)),
  },
  {
    path: "role-manager",
    element: <RoleManager />,
    loader: composedGuard(authGuard, permissionGuard(AppPermission.ROLE_READ)),
  },
  { path: "*", element: <Navigate to="dashboard" relative="route" /> },
];
