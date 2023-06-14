import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { FormEventHandler, useState } from "react";

import PasswordAdornment from "../password-adornment/password-adornment.component";

interface IPasswordTextField {
  id: string;
  name: string;
  label: string;
  onInput: FormEventHandler<HTMLInputElement>;
}

function PasswordTextField({ id, name, label, onInput }: IPasswordTextField) {
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const onPasswordShowBtnClick = () => {
    setIsPasswordShown((show) => !show);
  };

  const onPasswordMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <FormControl variant="outlined" onInput={onInput}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <OutlinedInput 
        id={id}
        name={name}
        label={label}
        required
        type={isPasswordShown ? "text" : "password"}
        endAdornment={ <PasswordAdornment showPassword={isPasswordShown} click={onPasswordShowBtnClick} mousedown={onPasswordMouseDown}/> }
      />
    </FormControl>
  );
}

export default PasswordTextField;
