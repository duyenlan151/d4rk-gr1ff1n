import "./shared/styles/_global.scss";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routes } from "./root.routing";

const router = createBrowserRouter(routes);

function Root() {
  return <RouterProvider router={router} />;
}

export default Root;
