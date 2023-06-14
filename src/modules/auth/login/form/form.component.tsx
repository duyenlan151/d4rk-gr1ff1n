import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel,OutlinedInput, SxProps, Theme } from "@mui/material";
import { FormEventHandler } from "react";
import { Link } from "react-router-dom";

import PasswordTextField from "../../../../shared/components/password-textfield/password-textfield.component";

interface IFormProps {
  onSubmit: FormEventHandler<HTMLFormElement>
  errorMessage?: string
}

function Form({ onSubmit, errorMessage }: IFormProps) {
  const buttonOverriddenStyles: SxProps<Theme> = { padding: '0', height: '50px', width: '200px', borderRadius: '5px' };

  return (
    <form className="gap-6 flex flex-col relative" onSubmit={onSubmit} autoComplete="off">
    { errorMessage && <span className="text-red-500 absolute -top-10">{ errorMessage }</span> }
      <FormGroup className="gap-6 flex flex-col">
        <FormControl>
          <InputLabel htmlFor="username">Username</InputLabel>
          <OutlinedInput id="username" name="username" label="Username" required/>
        </FormControl>
        <PasswordTextField id="password" name="password" label="Password"/>
      </FormGroup>
      <div className="flex flex-row justify-between">
        <FormControlLabel control={<Checkbox name="isRemember" />} label="Remember Me" />
        <Link to="/login" className="pt-2">Forgot password?</Link>
      </div>
      <div className="flex justify-around">
        <Button sx={buttonOverriddenStyles} type="submit" variant="contained">Login</Button>
        <Link to="/sign-up"><Button sx={buttonOverriddenStyles} variant="outlined">Sign Up</Button></Link>
      </div>
    </form>
  );
}

export default Form;
