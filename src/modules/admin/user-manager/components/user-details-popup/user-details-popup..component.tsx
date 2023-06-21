/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Modal, SxProps, Theme, Tooltip } from "@mui/material";
import { DetailedUser, PreviewUser } from "../../../../../shared/models/user/user.model";
import { useUserProvider } from "../../../../../shared/providers/user.provider";
import { Close, Edit, Delete } from "@mui/icons-material";
import { Signal, useSignal } from "@preact/signals-react";
import { useEffect } from "react";
import { tap } from "rxjs";

import Loader from "../../../../../shared/components/loader/loader.component";
import UserDetailsForm from "../user-details-form/user-details-form.component";

interface IUserDetailsPopup {
  user: Signal<PreviewUser | undefined>;
}

function UserDetailsPopup({ user }: IUserDetailsPopup) {
  const buttonOverriddenStyles: SxProps<Theme> = { display: 'flex', alignItems: 'center', gap: "5px", width: "100px" };

  const { getUser } = useUserProvider();
  const isLoading = useSignal<boolean>(false);
  const isEditing = useSignal<boolean>(false);
  const userDetails = useSignal<DetailedUser | undefined>(undefined);
  function onClose() {
    userDetails.value = user.value = undefined;
    isEditing.value = false;
  }

  function onChanges() {
    if (user.value) {
      _fetchUser(user.value.id as string).subscribe(
        (data) => (userDetails.value = data.set("id", user.value?.id as string))
      );
    }

    return () => {};
  }

  function _enableEditMode(): void {
    isEditing.value = true
  }

  function _fetchUser(id: string) {
    isLoading.value = true;
    return getUser(id).pipe(tap(() => (isLoading.value = false)));
  }

  useEffect(onChanges, [user.value]);

  return (
    <>
      <Modal open={!!userDetails.value} onClose={onClose}>
        <div className="grid grid-cols-1 auto-rows-fr divide-y absolute w-2/5 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/3 p-4 bg-white focus:outline-none rounded-lg h-1/2">
          <div id="header-container" className="flex items-center justify-between pb-2">
            <div id="header-text">
              <h1 className="font-semibold text-2xl">User Details</h1>
            </div>
            <div id="header-actions" className="h-full">
              <div className="cursor-pointer" onClick={onClose}>
                <Tooltip title="Close">
                  <Close/>
                </Tooltip>
              </div>
            </div>
          </div>
          <div id="body-container" className="pt-2 row-[span_9_/_span_9] grid grid-cols-1 auto-rows-fr">
            <div id="body-header" className="flex justify-between items-end">
              <div id="identifier">
                <p>ID: {userDetails.value?.id}</p>
              </div>
              <div id="body-action" className="flex items-center gap-2">
                <Button disabled={isEditing.value} variant="contained" sx={buttonOverriddenStyles} onClick={_enableEditMode}>
                  <Edit fontSize="small"/> <span className="pt-1">Edit</span>
                </Button>
                <Button disabled={isEditing.value} variant="contained" color="error" sx={buttonOverriddenStyles}>
                  <Delete fontSize="small"/> <span className="pt-1">Delete</span>
                </Button>
              </div>
            </div>
            <div id="body-content" className="row-[span_8_/_span_8]">
              {userDetails.value ? <UserDetailsForm user={userDetails.value} isEditing={isEditing}/> : undefined}
            </div>
          </div>
        </div>
      </Modal>
      <Loader isVisible={isLoading} />
    </>
  );
}

export default UserDetailsPopup;
