import { isObservable, firstValueFrom } from "rxjs";
import { GuardFn } from "./_guard.model";

function composedGuard(...guards: GuardFn<void>[]): GuardFn<any> {
  return async (): Promise<boolean> => {
    let canActivate = true;

    for (const guard of guards) {
      const result = guard();

      if ((typeof result === "boolean" && result) || (isObservable(result) && (await firstValueFrom(result))) || (result instanceof Promise && (await result))) {
        continue;
      }

      canActivate = false;
    }

    return canActivate;
  };
}

export default composedGuard;
