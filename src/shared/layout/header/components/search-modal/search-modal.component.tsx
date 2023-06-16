import { Modal, OutlinedInput, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";
import { Signal } from "@preact/signals-react";

interface ISearchModal {
  isVisible: Signal<boolean>;
}

function SearchModal({ isVisible }: ISearchModal) {
  return (
    <Modal open={isVisible.value} onClose={() => isVisible.value = !isVisible.value}>
      <div className="flex flex-col absolute w-2/5 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/3 p-3 bg-white focus:outline-none rounded-lg h-1/2">
        <div>
          <OutlinedInput 
            autoFocus={true} 
            placeholder="Search..." 
            className="w-full h-10 rounded-lg" 
            startAdornment={
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <div className="text-sm font-extrabold">ESC</div>
              </InputAdornment>
            }
          />
        </div>
      </div>
    </Modal>
  );
}

export default SearchModal;