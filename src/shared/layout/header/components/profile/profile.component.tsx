import { Tooltip, Avatar, Menu, MenuItem, Divider, ListItemIcon } from "@mui/material";
import { Settings, Logout, Handyman } from "@mui/icons-material";
import { useUserContext } from "../../../../providers/user.provider";
import { useNavigate } from "react-router-dom";
import { MouseEvent } from "react";
import { useSignal } from "@preact/signals-react";
import { Constants } from "../../../../constants.enum";

const paperStyle = {
  elevation: 0,
  sx: {
    overflow: "visible",
    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
    mt: 1.5,
    "& .MuiAvatar-root": {
      width: 32,
      height: 32,
      ml: -0.5,
      mr: 1,
    },
    "&:before": {
      content: '""',
      display: "block",
      position: "absolute",
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: "background.paper",
      transform: "translateY(-50%) rotate(45deg)",
      zIndex: 0,
    },
  },
};

function ProfileMenu() {
  const { user } = useUserContext();
  const anchorEl = useSignal<null | HTMLElement>(null);
  const navigate = useNavigate();

  function onProfileClicked(event: MouseEvent<HTMLElement>): void {
    _openMenu(event.currentTarget as HTMLElement);
  }

  function onAdminToolkitClicked(): void {
    navigate("/admin");
  }

  function onLogoutBtnClicked(): void {
    localStorage.removeItem(Constants.LOCAL_STORAGE_TOKEN);
    localStorage.removeItem(Constants.LOCAL_STORAGE_USERNAME);
    user.value = undefined;
  }

  function onMenuClosed(): void {
    _closeMenu();
  }

  function _openMenu(target: HTMLElement): void {
    anchorEl.value = target;
  }

  function _closeMenu(): void {
    anchorEl.value = null;
  }

  return (
    <>
      <div className="cursor-pointer">
        <Tooltip title="Account Settings">
          <div onClick={onProfileClicked}>
            <Avatar />
          </div>
        </Tooltip>
      </div>
      <Menu
        id="account-menu"
        anchorEl={anchorEl.value}
        open={!!anchorEl.value}
        onClose={onMenuClosed}
        onClick={onMenuClosed}
        slotProps={{ paper: paperStyle }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={onMenuClosed}
          className="flex-col"
          sx={{ alignItems: "start" }}
        >
          <div>Signed in as:</div>
          <div className="font-semibold">{user.value?.username}</div>
        </MenuItem>
        <Divider />
        {user.value?.roles?.includes("Admin") ? (
          <MenuItem onClick={onAdminToolkitClicked}>
            <ListItemIcon>
              <Handyman fontSize="small" />
            </ListItemIcon>
            Admin toolkit
          </MenuItem>
        ) : undefined}
        <MenuItem onClick={onMenuClosed}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={onLogoutBtnClicked}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}

export default ProfileMenu;