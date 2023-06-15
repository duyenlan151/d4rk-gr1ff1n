import "./shared/styles/_global.scss";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { User, UserContext, useUserProvider } from "./shared/providers/user.provider";
import { routes } from "./root.routing";
import { useSignal } from "@preact/signals-react";
import { useEffect } from "react";
import { Constants } from "./shared/constants.enum";
import { firstValueFrom } from "rxjs"

const router = createBrowserRouter(routes);

function Root() {
  const user = useSignal<User | undefined>(undefined);
  const { getPermissionList } = useUserProvider();

  async function loadUser() {
    const accessToken = localStorage.getItem(Constants.LOCAL_STORAGE_TOKEN);

    if (accessToken && !user.value) {
      user.value = new User({
        username: localStorage.getItem(Constants.LOCAL_STORAGE_USERNAME) as string,
        permissions: await firstValueFrom(getPermissionList()),
      });
    }
  }

  useEffect(() => {
    loadUser();
  });

  return (
    <UserContext.Provider value={{ user }}>
      <RouterProvider router={router} />
    </UserContext.Provider>
  );
}

export default Root;
