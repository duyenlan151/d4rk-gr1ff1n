/* eslint-disable react-hooks/rules-of-hooks */
import { catchError, of, tap } from "rxjs";
import { AppPermission } from "../constants.enum";
import { redirect } from "react-router-dom";
import { GuardFn } from "./_guard.model";

import useAuthProvider from "../../modules/auth/auth.provider";

function permissionGuard(...required: AppPermission[]): GuardFn {
  function canActivate(value: boolean) {
    if (!value) {
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
        catchError(() => of(false)),
        tap(canActivate)
      );
  };
}

export default permissionGuard;
