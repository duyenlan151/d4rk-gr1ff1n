import { useEffect } from "react";
import { useCommissionContext } from "../commission.provider";
import { Observable, Subject, takeUntil } from "rxjs";

function List() {
  const { commissionList$ } = useCommissionContext();

  useEffect(() => {
    const onDestroy$ = new Subject<void>();

    _registerStore(commissionList$, console.log);

    function _registerStore<T>(store$: Observable<T>, processor: (data: T) => void) {
      store$.pipe(takeUntil(onDestroy$)).subscribe(processor);
    }

    return () => onDestroy$.next();
  }, [commissionList$]);

  return (
    <>
      <p>List component works</p>
    </>
  );
}

export default List;
