import { Observable, map } from "rxjs";
import { environment } from "../environments/environment";
import { CompactRole } from "../models/role/role.model";
import { ICompactRoleWithPermissionIdsDto, IRoleDto } from "../models/role/role.dto";

import useHttpProvider, { IResponse } from "./http.provider";
import { List } from "immutable";

interface IRoleQuery {
  compact: boolean;
  permissions: boolean;
}

interface IRoleProvider {
  getRoles(params?: Partial<IRoleQuery>): Observable<List<CompactRole>>;
}

function useRoleProvider(): IRoleProvider {
  const { get } = useHttpProvider();
  const _endpoint = `${environment.remoteServiceURL}/role`;

  function getRoles(params?: Partial<IRoleQuery>): Observable<List<CompactRole>> {
    const roleMapper = ({ data }: IResponse<ICompactRoleWithPermissionIdsDto[]>) => {
      const roles = [];

      for (const role of data) {
        const ids = [];

        for (const { id } of role.permissions) {
          ids.push(id);
        }

        roles.push(new CompactRole({ ...role, permissions: List(ids) }));
      }

      return List(roles);
    }
      
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

    return get<IRoleDto[]>(_endpoint, httpOptions).pipe(map(roleMapper));
  }

  return { getRoles };
}

export default useRoleProvider;
