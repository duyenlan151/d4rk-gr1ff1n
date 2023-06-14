import { InputLabel, OutlinedInput } from "@mui/material";
import { useState } from "react";

import PasswordAdornment from "../password-adornment/password-adornment.component";

interface IPasswordTextField {
  id: string;
  name: string;
  label: string;
}

function PasswordTextField({ id, name, label }: IPasswordTextField) {
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const onPasswordShowBtnClick = () => {
    setIsPasswordShown((show) => !show);
  };

  const onPasswordMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <OutlinedInput 
        id={id}
        name={name}
        label={label}
        required
        type={isPasswordShown ? "text" : "password"}
        endAdornment={ <PasswordAdornment showPassword={isPasswordShown} click={onPasswordShowBtnClick} mousedown={onPasswordMouseDown}/> }
      />
    </>
  );
}

export default PasswordTextField;
