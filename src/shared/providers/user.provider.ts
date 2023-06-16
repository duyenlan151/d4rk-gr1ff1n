import { createContext, useContext } from "react";
import { Observable, map } from "rxjs";
import { AppPermission } from "../constants.enum";
import { environment } from "../environments/environment";
import { Record } from "immutable";
import { Signal } from "@preact/signals-react";

import useHttpProvider from "./http.provider";

interface IUser {
  username?: string;
  permissions?: string[];
  roles?: string[]
}

interface IUserProvider {
  getPermissionList(): Observable<AppPermission[]>;
  getRoleList(): Observable<string[]>;
}

export class User extends Record<IUser>({
  username: undefined,
  permissions: undefined,
  roles: undefined,
}) {}

type UserContextType = {
  user: Signal<User | undefined>;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export function useUserContext() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error();
  }

  return context;
}

export function useUserProvider(): IUserProvider {
  const { get } = useHttpProvider();

  function getPermissionList(): Observable<AppPermission[]> {
    const url = `${environment.remoteServiceURL}/permission/current-user`;

    return get<AppPermission[]>(url).pipe(map(({ data }) => data));
  }

  function getRoleList(): Observable<string[]> {
    const url = `${environment.remoteServiceURL}/role/current-user`;

    return get<string[]>(url).pipe(map(({ data }) => data));
  }

  return { getPermissionList, getRoleList };
}
