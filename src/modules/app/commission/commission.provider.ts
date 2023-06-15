import { createContext, useContext } from "react";
import { Observable, map } from "rxjs";
import { environment } from "../../../shared/environments/environment";
import { List } from "immutable";

import useHttpProvider from "../../../shared/providers/http.provider";

interface CommissionContextType {
  commissionList$: Observable<List<Commission>>;
}

export interface Commission {
  imageSrc: string;
  name: string;
  price: number;
}

export const CommissionContext = createContext<CommissionContextType | undefined>(undefined);

export function useCommissionContext() {
  const context = useContext(CommissionContext);

  if (!context) {
    throw new Error();
  }

  return context;
}

export function useCommissionProvider() {
  const { get } = useHttpProvider();
  const _endpoint = `${environment.remoteServiceURL}/commission`;

  function getCommissionList(): Observable<List<Commission>> {
    const url = _endpoint;

    return get<Commission[]>(url).pipe(map(({ data }) => List(data)));
  }

  return { getCommissionList };
}
