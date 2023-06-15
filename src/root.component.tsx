import "./shared/styles/_global.scss";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { User, UserContext } from "./shared/providers/user.provider";
import { useState } from "react";
import { routes } from "./root.routing";
import { useSignal } from "@preact/signals-react";

const router = createBrowserRouter(routes);

function Root() {
  const user = useSignal<User | undefined>(undefined);

  

  return (
    <UserContext.Provider value={{ user }}>
      <RouterProvider router={router} />
    </UserContext.Provider>
  );
}

export default Root;
