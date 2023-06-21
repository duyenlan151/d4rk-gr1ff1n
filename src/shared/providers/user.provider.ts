import { IDetailedUserDto, ILoggedInUserDto, IPreviewUserDto } from "../models/user/user.dto";
import { LoggedInUser, PreviewUser, DetailedUser } from "../models/user/user.model";
import { createContext, useContext } from "react";
import { LoggedInUserRole } from "../models/role/role.model";
import { Observable, map } from "rxjs";
import { environment } from "../environments/environment";
import { DateTime } from "luxon";
import { Signal } from "@preact/signals-react";
import { List } from "immutable";

import useHttpProvider, { IResponse } from "./http.provider";

interface IUserContext {
  user: Signal<LoggedInUser | undefined>;
}

export const UserContext = createContext<IUserContext | undefined>(undefined);


export function useUserContext(): IUserContext {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error();
  }

  return context;
}

interface IUserProvider {
  getLoggedInUser(): Observable<LoggedInUser>;
  getUsers(): Observable<PreviewUser[]>;
  getUser(id: string): Observable<DetailedUser>;
}

export function useUserProvider(): IUserProvider {
  const { get } = useHttpProvider();
  const _endpoint = `${environment.remoteServiceURL}/user`;

  function getLoggedInUser(): Observable<LoggedInUser> {
    const url = `${_endpoint}/current`;
    const loggedInUserMapper = ({ data }: IResponse<ILoggedInUserDto>) => {
      const roles = [];

      for (const { name, permissions } of data.roles) {
        const names: string[] = [];

        for (const { name } of permissions) {
          names.push(name);
        }

        roles.push(new LoggedInUserRole({ name, permissions: List(names) }));
      }

      return new LoggedInUser({ username: data.username, roles: List(roles) });
    };

    return get<ILoggedInUserDto>(url).pipe(map(loggedInUserMapper));
  }

  function getUsers(): Observable<PreviewUser[]> {
    const millisToDateTime = (milis: string) => DateTime.fromMillis(Number(milis));
    const userMapper = ({ createTime, updateTime, roles, ...others }: IPreviewUserDto) =>
      new PreviewUser({
        ...others,
        createTime: millisToDateTime(createTime),
        updateTime: millisToDateTime(updateTime),
        roles: List(roles.map(({ id }) => id)),
      });

    return get<IPreviewUserDto[]>(_endpoint).pipe(
      map(({ data }) => data.map(userMapper))
    );
  }

  function getUser(id: string): Observable<DetailedUser> {
    const url = `${_endpoint}/${id}`;
    const detailedUserMapper = ({ data }: IResponse<IDetailedUserDto>) =>
      new DetailedUser({ ...data, roles: List(data.roles) });

    return get<IDetailedUserDto>(url).pipe(map(detailedUserMapper));
  }

  return { getLoggedInUser, getUsers, getUser };
}
