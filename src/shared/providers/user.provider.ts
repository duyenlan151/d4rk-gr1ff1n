import { createContext, useContext } from "react";
import { Observable, map } from "rxjs";
import { AppPermission } from "../constants.enum";
import { List, Record } from "immutable";
import { environment } from "../environments/environment";
import { Signal } from "@preact/signals-react";
import { DateTime } from "luxon";

import useHttpProvider from "./http.provider";

interface IGenericUser {
  id: string;
  createTime: string;
  updateTime: string;
  username: string;
  email: string;
  roles: IGenericRole[];
}

interface IGenericRole {
  id: string;
  name: string;
  enabled: boolean;
}

export class GenericRole extends Record<Partial<IGenericRole>>({
  id: undefined,
  name: undefined,
  enabled: undefined,
}) {}

interface IGenericUserRecord extends Omit<IGenericUser, "roles" | "createTime" | "updateTime"> {
  createTime: DateTime,
  updateTime: DateTime,
  roles: List<GenericRole>;
}

export class GenericUser extends Record<Partial<IGenericUserRecord>>({
  id: undefined,
  createTime: undefined,
  updateTime: undefined,
  username: undefined,
  email: undefined,
  roles: List(),
}) {}

interface IUser {
  username?: string;
  permissions?: string[];
  roles?: string[];
}

interface IUserProvider {
  getPermissionList(): Observable<AppPermission[]>;
  getRoleList(): Observable<string[]>;
  getAllUser(): Observable<GenericUser[]>;
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
  const _enpoint = `${environment.remoteServiceURL}/user`;

  function getPermissionList(): Observable<AppPermission[]> {
    const url = `${environment.remoteServiceURL}/permission/current-user`;

    return get<AppPermission[]>(url).pipe(map(({ data }) => data));
  }

  function getRoleList(): Observable<string[]> {
    const url = `${environment.remoteServiceURL}/role/current-user`;

    return get<string[]>(url).pipe(map(({ data }) => data));
  }

  function getAllUser(): Observable<GenericUser[]> {
    const millisToDateTime = (milis: string) => DateTime.fromMillis(Number(milis));
    const userMapper = ({ createTime, updateTime, roles, ...others }: IGenericUser) =>
      new GenericUser({
        ...others,
        createTime: millisToDateTime(createTime),
        updateTime: millisToDateTime(updateTime),
        roles: List(roles.map((role) => new GenericRole(role))),
      });

    return get<IGenericUser[]>(_enpoint).pipe(
      map(({ data }) => data.map(userMapper))
    );
  }

  return { getPermissionList, getRoleList, getAllUser };
}
