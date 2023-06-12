import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, IconButton, InputAdornment, InputLabel, Link, OutlinedInput, SxProps, TextField, Theme } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FormEventHandler, useState } from "react";

interface IFormProps {
  onSubmit: FormEventHandler<HTMLFormElement>
}

function Form({ onSubmit }: IFormProps) {
  const buttonOverriddenStyles: SxProps<Theme> = { padding: '0', height: '50px', width: '200px', borderRadius: '5px' };
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const onPasswordShowBtnClick = () => {
    setIsPasswordShown((show) => !show)
  };

  const onPasswordMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <form className="gap-6 flex flex-col" onSubmit={onSubmit}>
      <FormGroup className="gap-6 flex flex-col">
        <TextField id="outlined-basic" label="Username" variant="outlined" name="username"/>
        <FormControl variant="outlined">
          <InputLabel htmlFor="password">Password</InputLabel>
          <OutlinedInput
            id="password"
            name="password"
            label="Password"
            type={isPasswordShown ? "text" : "password"}
            endAdornment={<PasswordAdornment showPassword={isPasswordShown} click={onPasswordShowBtnClick} mousedown={onPasswordMouseDown}/>}
          />
        </FormControl>
      </FormGroup>
      <div className="flex flex-row justify-between">
        <FormControlLabel control={<Checkbox name="isRemember"/>} label="Remember Me" />
        <Link href="/login" className="pt-2">Forgot password?</Link>
      </div>
      <div className="flex justify-around">
        <Button sx={buttonOverriddenStyles} type="submit" variant="contained">Login</Button>
        <Button sx={buttonOverriddenStyles} variant="outlined">Sign Up</Button>
      </div>
    </form>
  );
}

function PasswordAdornment({ showPassword, click, mousedown, }: IPasswordAdornment) {
  return (
    <InputAdornment position="end">
      <IconButton
        aria-label="toggle password visibility"
        onClick={click}
        onMouseDown={mousedown}
      >
        {showPassword ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  );
}

interface IPasswordAdornment {
  showPassword: boolean;
  click: () => void;
  mousedown: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default Form;
