import { Observable } from "rxjs";

export type GuardFn<T = void> = (params: T) => boolean | Promise<boolean> | Observable<boolean>;