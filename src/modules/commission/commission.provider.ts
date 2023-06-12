import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "../../shared/environments/environment";
import { List } from "immutable";

interface ICommissionListProvider {
  commissionList$: Observable<any>;
  populateCommissionList: () => void;
}

function useCommissionProvider(): ICommissionListProvider {
  const _endpoint = `${environment.remoteServiceURL}/commission`;
  const _commissionList = new BehaviorSubject(List());
  const commissionList$ = _commissionList.asObservable();

  function populateCommissionList(): void {
    _commissionList.next(List([1, 2, 3]));
  }

  return { commissionList$, populateCommissionList };
}

export default useCommissionProvider;
