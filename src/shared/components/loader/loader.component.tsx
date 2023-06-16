import { Backdrop, CircularProgress } from "@mui/material";
import { Signal } from "@preact/signals-react";

interface ILoader {
  isVisible: Signal<boolean>;
}

function Loader({ isVisible }: ILoader) {
  return (
    <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isVisible.value}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

export default Loader;
