import { Commission, CommissionContext } from "./commission.provider";
import { BehaviorSubject } from "rxjs";
import { Outlet } from "react-router-dom";
import { List } from "immutable";

function Commission() {
  const _commissionList = new BehaviorSubject(List<Commission>());

  return (
    <CommissionContext.Provider value={{ commissionList$: _commissionList.asObservable() }}>
      <Outlet />
    </CommissionContext.Provider>
  );
}

export default Commission;
