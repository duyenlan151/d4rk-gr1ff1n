import { Observable, map } from "rxjs";
import { environment } from "../environments/environment";
import { IRoleDto } from "../models/role/role.dto";

import useHttpProvider from "./http.provider";

interface IRoleQuery {
  compact: boolean;
  permissions: boolean;
}

interface IRoleProvider {
  getRoles(params?: Partial<IRoleQuery>): Observable<IRoleDto[]>;
}

function useRoleProvider(): IRoleProvider {
  const { get } = useHttpProvider();
  const _endpoint = `${environment.remoteServiceURL}/role`;

  function getRoles(params?: Partial<IRoleQuery>): Observable<IRoleDto[]> {
    let httpOptions;

    if (params) {
      const { compact, permissions } = params;
      const _params: Record<string, string> = {};

      if (compact) {
        _params["compact"] = "true";
      }

      if (permissions) {
        _params["permissions"] = "true";
      }

      httpOptions = { params: _params };
    }

    return get<IRoleDto[]>(_endpoint, httpOptions).pipe(
      map(({ data }) => data)
    );
  }

  return { getRoles };
}

export default useRoleProvider;
