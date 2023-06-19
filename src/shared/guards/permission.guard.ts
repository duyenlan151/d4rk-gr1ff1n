/* eslint-disable react-hooks/rules-of-hooks */
import { catchError, map, of, tap } from "rxjs";
import { AppPermission } from "../constants.enum";
import { redirect } from "react-router-dom";
import { GuardFn } from "./_guard.model";

import useAuthProvider from "../../modules/auth/auth.provider";

function permissionGuard(...required: AppPermission[]): GuardFn {

  function canActivate(value: boolean | undefined) {
    if (typeof value === "boolean" && !value) {
      throw redirect("/");
    }
  }

  return () => {
    if (!required) {
      return true;
    }

    return useAuthProvider()
      .isGranted(...required)
      .pipe(
        catchError(() => of(undefined)),
        tap(canActivate),
        map((value) => !!value)
      );
  };
}

export default permissionGuard;
