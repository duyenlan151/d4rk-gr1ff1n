import { Subject, fromEvent, takeUntil, filter } from "rxjs";
import { useSignal } from "@preact/signals-react";
import { useEffect } from "react";
import { Search } from "@mui/icons-material";

import SearchModal from "../search-modal/search-modal.component";

function SearchButton() {
  const isPopupShown = useSignal(false);

  function onKeyCombinationChanged(event: KeyboardEvent): void {
    event.preventDefault();

    _togglePopup();
  }

  function onSearchContainerClick(): void {
    _togglePopup()
  }

  useEffect(() => {
    const onDestroy$ = new Subject<void>();
    const keydown$ = fromEvent<KeyboardEvent>(document, "keydown");
    const keyCombinationChanged$ = keydown$.pipe(
      takeUntil(onDestroy$),
      filter((event) => (event.ctrlKey || event.metaKey) && event.key === "k")
    );

    keyCombinationChanged$.subscribe(onKeyCombinationChanged);

    return () => onDestroy$.next();
  });

  function _togglePopup(): void {
    isPopupShown.value = !isPopupShown.value;
  }

  return (
    <>
      <div onClick={onSearchContainerClick} className="flex justify-between items-center w-60 border border-slate-500 rounded-md py-1 px-2 text-slate-500 cursor-pointer select-none hover:bg-gray-50">
        <div className="flex gap-2 items-center">
          <Search fontSize="small" />
          <span>Search...</span>
        </div>
        <div className="text-sm font-bold opacity-80">Ctrl K</div>
      </div>
      <SearchModal isVisible={isPopupShown}/>
    </>
  );
}

export default SearchButton;