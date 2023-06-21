import { createContext, useContext } from "react";
import { IToasOptions } from "../components/toast/toast.component";

type ToastContextType = {
  showToast(message: string, options?: Partial<IToasOptions>): void;
};

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);

export function useToastContext() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error();
  }

  return context;
}
