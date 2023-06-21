import { createContext, useContext } from "react";
import { LoggedInUser } from "../models/user/user.model";
import { Signal } from "@preact/signals-react";

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