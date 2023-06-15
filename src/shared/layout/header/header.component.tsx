/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, Divider, InputAdornment, ListItemIcon, Menu, MenuItem, Modal, OutlinedInput, Tooltip } from "@mui/material";
import { Settings, Logout, East, NotificationsOutlined, Search } from "@mui/icons-material";
import { Subject, filter, fromEvent, takeUntil } from "rxjs";
import { MouseEvent, useEffect } from "react";
import { useUserContext } from "../../providers/user.provider";
import { useSignal } from "@preact/signals-react";
import { Constants } from "../../constants.enum";
import { Link } from "react-router-dom";

import Logo from "../../components/logo/logo.component";

function LoginButton() {
  return (
    <div id="login">
      <Link to="/login">Login</Link>
    </div>
  );
}

function GetStartedButton() {
  return (
    <Link to="/sign-up">
      <div id="get-started" className="bg-emerald-700 rounded-3xl p-2 px-4 text-white flex gap-1 items-center shadow-md shadow-emerald-700/50">
        <span>Get Started</span> <East fontSize="inherit" />
      </div>
    </Link>
  );
}

function Profile() {
  const { user } = useUserContext();
  const anchorEl = useSignal<null | HTMLElement>(null);

  function onProfileClicked(event: MouseEvent<HTMLElement>): void {
    _openMenu(event.currentTarget as HTMLElement);
  }

  function onLogoutBtnClicked() {
    _closeMenu();

    localStorage.removeItem(Constants.LOCAL_STORAGE_TOKEN);
    localStorage.removeItem(Constants.LOCAL_STORAGE_USERNAME);
    user.value = undefined;
  }

  function onMenuClosed() {
    _closeMenu();
  }

  function _openMenu(target: HTMLElement) {
    anchorEl.value = target;
  }

  function _closeMenu() {
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
        slotProps={{
          paper: {
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
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={onMenuClosed} className="flex-col" sx={{ alignItems: 'start' }}>
          <div>Signed in as:</div>
          <div className="font-semibold">{user.value?.username}</div>
        </MenuItem>
        <Divider />
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

function Notification() {
  return <NotificationsOutlined />
}

function UnAuthorizedActions() {
  return (
    <>
      <LoginButton />
      <GetStartedButton />
    </>
  );
}

function AuthorizedActions() {
  return (
    <>
      <Notification />
      <Profile />
    </>
  );
}

function SearchButton() {
  const isPopupShown = useSignal(false);

  function onKeyCombinationChanged(event: KeyboardEvent): void {
    event.preventDefault();

    _togglePopup();
  }

  function onSearchContainerClick(): void {
    _togglePopup()
  }

  useEffect(() => {
    const onDestroy$ = new Subject<void>();
    const keydown$ = fromEvent<KeyboardEvent>(document, "keydown");
    const keyCombinationChanged$ = keydown$.pipe(
      takeUntil(onDestroy$),
      filter((event) => (event.ctrlKey || event.metaKey) && event.key === "k")
    );

    keyCombinationChanged$.subscribe(onKeyCombinationChanged);

    return () => onDestroy$.next();
  });

  function _togglePopup(): void {
    isPopupShown.value = !isPopupShown.value;
  }

  return (
    <>
      <div onClick={onSearchContainerClick} className="flex justify-between items-center w-60 border border-slate-500 rounded-md py-1 px-2 text-slate-500 cursor-pointer select-none hover:bg-gray-50">
        <div className="flex gap-2 items-center">
          <Search fontSize="small" />
          <span>Search...</span>
        </div>
        <div className="text-sm font-bold opacity-80">Ctrl K</div>
      </div>
      <SearchModal isVisible={isPopupShown}/>
    </>
  );
}

function SearchModal({ isVisible }: Record<string, any>) {
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

function Header() {
  const { user } = useUserContext();
  const loggedIn = useSignal(!!localStorage.getItem(Constants.LOCAL_STORAGE_TOKEN));

  useEffect(() => {
    loggedIn.value = !!localStorage.getItem(Constants.LOCAL_STORAGE_TOKEN);
  }, [user.value]);

  return (
    <header className="w-full h-20 flex justify-center bg-white">
      <div className="container h-full flex items-center justify-between font-medium">
        <div id="public-section" className="flex gap-10 h-full items-center">
          <div id="branding">
            <div id="logo-container" className="cursor-pointer">
              <Link to="/">
                <Logo className="w-12 h-12" />
              </Link>
            </div>
          </div>
          <div id="all-user-actions" className="flex gap-6 h-full items-center">
            <SearchButton />
            <div>Explore</div>
          </div>
        </div>
        <div id="actions" className="flex items-center gap-10">
          {loggedIn.value || user.value ? (<AuthorizedActions />) : (<UnAuthorizedActions />)}
        </div>
      </div>
    </header>
  );
}

export default Header;
