import "./transition.component.scss";

import { TransitionGroup, CSSTransition } from "react-transition-group";
import { TransitionContext } from "../../providers/transition.provider";
import { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import { useSignal } from "@preact/signals-react";

function Transition({ children }: PropsWithChildren) {
  const location = useLocation();
  const entered = useSignal(true);

  function onTransitionEntered(): void {
    entered.value = true
  }

  function onTransitionEnter(): void {
    entered.value = false;
  }

  return (
    <TransitionContext.Provider value={{ entered }}>
      <TransitionGroup className="transition-wrapper overflow-x-hidden">
        <CSSTransition key={location.key} onEntered={onTransitionEntered} onEnter={onTransitionEnter} classNames="transition" exit={false} timeout={300}>
          {children}
        </CSSTransition>
      </TransitionGroup>
    </TransitionContext.Provider>
  );
}

export default Transition;
