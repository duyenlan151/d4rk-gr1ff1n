/* eslint-disable react-hooks/rules-of-hooks */
import { catchError, map, of, tap } from "rxjs";
import { environment } from "../environments/environment";
import { redirect } from "react-router-dom";
import { GuardFn } from "./_guard.model";

import useHttpProvider from "../providers/http.provider";

function permissionGuard(...required: string[]): GuardFn {
  function canActivate(value: boolean) {
    if (!value) {
      throw redirect("/");
    }
  }

  return () => {
    if (!required) {
      return true;
    }

    return useHttpProvider()
      .get<boolean>(`${environment.remoteServiceURL}/auth/can-activate`, { params: { required: required.join(',') } })
      .pipe(
        catchError(() => of({ data: false })),
        map(({ data }) => data),
        tap(canActivate)
      );
  };
}

export default permissionGuard;
