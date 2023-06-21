import { Box, Button, FormControl, FormGroup, InputLabel, List, OutlinedInput } from "@mui/material";
import { FormEvent, FormEventHandler, useEffect } from "react";
import { Signal, useSignal } from "@preact/signals-react";
import { DetailedUser } from "../../../../../shared/models/user/user.model";
import { IDetailedUser } from "../../../../../shared/models/user/user.interface";

interface IUserDetailsForm {
  user: DetailedUser;
  isEditing: Signal<boolean>;
}

function FormActions({ isEditing, onEditingCancel }: { isEditing: Signal<boolean>, onEditingCancel: () => void }) {
  function _onCancelClick(): void {
    onEditingCancel();
    isEditing.value = false;
  }

  return (
    <div id="form-actions" className="absolute bottom-0 right-0 flex gap-2">
      <Button variant="contained" type="submit" color="success">Save</Button>
      <Button variant="outlined" color="error" onClick={_onCancelClick}>Cancel</Button>
    </div>
  );
}

function UserDetailsForm({ isEditing, user }: IUserDetailsForm) {
  const pendingUser = useSignal<DetailedUser>(user);

  function onEditingCancel(): void {
    pendingUser.value = user;
  }

  function _getInputHandler(propName: keyof IDetailedUser): FormEventHandler<HTMLInputElement> {
    return (event: FormEvent<HTMLInputElement>): void => {
      event.preventDefault();
      
      pendingUser.value = pendingUser.value?.set(
        propName,
        (event.target as HTMLInputElement).value
      );
    }
  }

  return (
    <form className="h-full w-full relative pt-4 grid grid-cols-1 gap-2">
      <FormGroup sx={{ flexDirection: "row" }} className="gap-2">
        <FormControl className="flex-1">
          <InputLabel htmlFor="username">Username</InputLabel>
          <OutlinedInput
            id="username"
            label="Username"
            value={pendingUser.value.username}
            onInput={_getInputHandler("username")}
            readOnly={!isEditing.value}
          ></OutlinedInput>
        </FormControl>
        <FormControl className="flex-1">
          <InputLabel htmlFor="email">Email</InputLabel>
          <OutlinedInput
            id="email"
            label="Email"
            value={pendingUser.value.email}
            onInput={_getInputHandler("email")}
            inputMode="email"
            readOnly={!isEditing.value}
          ></OutlinedInput>
        </FormControl>
      </FormGroup>
      <Box className="flex gap-2">
        <List>
        </List>
        <List>
          
        </List>
      </Box>
      {isEditing.value ? (
        <FormActions isEditing={isEditing} onEditingCancel={onEditingCancel} />
      ) : undefined}
    </form>
  );
}

export default UserDetailsForm;
