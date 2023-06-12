import { useEffect } from "react";
import useCommissionProvider from "../commission.provider";

function List() {
  const { commissionList$, populateCommissionList } = useCommissionProvider();

  useEffect(() => {
    commissionList$.subscribe((list) => console.log(list));
  }, []);

  return (
    <>
      <p>List component works</p>
    </>
  );
}

export default List;
