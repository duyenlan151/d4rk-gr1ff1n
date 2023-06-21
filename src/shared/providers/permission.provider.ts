import { map } from "rxjs";
import { environment } from "../environments/environment";
import useHttpProvider from "./http.provider";

export interface IPermission {
  id: string;
  name: string;
  description: string;
}

function usePermissionProvider() {
  const { get } = useHttpProvider();
  const _endpoint = `${environment.remoteServiceURL}/permission`;

  function getPermissions(params?: { full: boolean }) {
    let httpOptions;

    if (params?.full) {
      httpOptions = { params: { full: "true" } };
    }

    return get(_endpoint, httpOptions).pipe(map(({ data }) => data));
  }

  return { getPermissions };
}

export default usePermissionProvider;
