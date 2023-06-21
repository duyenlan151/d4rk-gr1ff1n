/* eslint-disable react-hooks/exhaustive-deps */
import 'overlayscrollbars/overlayscrollbars.css';
import "./shared/styles/_global.scss";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useUserProvider } from "./shared/providers/user.provider";
import { LoggedInUser } from './shared/models/user/user.model';
import { UserContext } from './shared/contexts/user.context';
import { Constants } from "./shared/constants.enum";
import { useSignal } from "@preact/signals-react";
import { useEffect } from "react";
import { routes } from "./root.routing";

import ToastProvider from "./shared/components/toast/toast.component";

const router = createBrowserRouter(routes);

function Root() {
  const { getLoggedInUser } = useUserProvider();
  const user = useSignal<LoggedInUser | undefined>(undefined);

  function loadUser(): void {
    const accessToken = localStorage.getItem(Constants.LOCAL_STORAGE_TOKEN);

    if (accessToken && !user.value) {
      getLoggedInUser().subscribe((_user) => (user.value = _user));
    }
  }

  useEffect(() => {
    loadUser();
  }, [user.value]);

  return (
    <UserContext.Provider value={{ user }}>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </UserContext.Provider>
  );
}

export default Root;
