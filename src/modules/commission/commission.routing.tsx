/* eslint-disable react-refresh/only-export-components */
import { RouteObject } from "react-router-dom";
import { lazy } from "react";

const List = lazy(() => import("./list/list.component.tsx"));

export const routes: RouteObject[] = [
  { path: "", element: <List /> },
];
