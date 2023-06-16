/* eslint-disable react-hooks/exhaustive-deps */
import "./shared/styles/_global.scss";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { User, UserContext, useUserProvider } from "./shared/providers/user.provider";
import { Constants } from "./shared/constants.enum";
import { useSignal } from "@preact/signals-react";
import { useEffect } from "react";
import { forkJoin } from "rxjs"
import { routes } from "./root.routing";
import ToastProvider from "./shared/components/toast/toast.component";

const router = createBrowserRouter(routes);

function Root() {
  const { getPermissionList, getRoleList } = useUserProvider();
  const user = useSignal<User | undefined>(undefined);

  function loadUser(): void {
    const accessToken = localStorage.getItem(Constants.LOCAL_STORAGE_TOKEN);

    if (accessToken && !user.value) {
      forkJoin([getPermissionList(), getRoleList()]).subscribe(
        ([permissions, roles]) => {
          user.value = new User({ permissions, roles, username: localStorage.getItem(Constants.LOCAL_STORAGE_USERNAME) as string });
        }
      );
    }
  }

  useEffect(() => {
    loadUser();
  });

  return (
    <UserContext.Provider value={{ user }}>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </UserContext.Provider>
  );
}

export default Root;
