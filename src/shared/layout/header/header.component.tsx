/* eslint-disable react-hooks/exhaustive-deps */
import { useUserContext } from "../../providers/user.provider";
import { useEffect } from "react";
import { useSignal } from "@preact/signals-react";
import { Constants } from "../../constants.enum";
import { Link } from "react-router-dom";

import Logo from "../../components/logo/logo.component";
import SearchButton from "./components/search-button/search-button.component";
import ProfileMenu from "./components/profile/profile.component";
import NotificationButton from "./components/notification/notification.component";
import GetStartedButton from "./components/get-started-button/get-started.component";
import LoginButton from "./components/login-button/login-button.component";


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
      <NotificationButton />
      <ProfileMenu />
    </>
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
