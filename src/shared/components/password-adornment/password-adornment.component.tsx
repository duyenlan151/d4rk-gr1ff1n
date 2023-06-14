import { VisibilityOff, Visibility } from "@mui/icons-material";
import { InputAdornment, IconButton } from "@mui/material";

interface IPasswordAdornment {
  showPassword: boolean;
  click: () => void;
  mousedown: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

function PasswordAdornment({ showPassword, click, mousedown, }: IPasswordAdornment) {
  return (
    <InputAdornment position="end">
      <IconButton aria-label="toggle password visibility" onClick={click} onMouseDown={mousedown}>
        {showPassword ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  );
}

export default PasswordAdornment;