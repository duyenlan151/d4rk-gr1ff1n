import { createContext, useContext } from "react";
import { Signal } from "@preact/signals-react";

type TransitionContextType = {
  entered: Signal<boolean>;
};

export const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function useTransitionContext() {
  const context = useContext(TransitionContext);

  if (!context) {
    throw new Error();
  }

  return context;
}
