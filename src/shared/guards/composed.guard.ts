import { GuardFn } from "./_guard.model";

function composedGuard(...guards: GuardFn<void>[]): GuardFn<any> {
  return () => guards.every((guard) => guard());
}

export default composedGuard;
