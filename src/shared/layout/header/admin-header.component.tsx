import { Link } from "react-router-dom";

import NotificationButton from "./components/notification/notification.component";
import ProfileMenu from "./components/profile/profile.component";
import Logo from "../../components/logo/logo.component";

function AdminHeader() {
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
        </div>
        <div id="actions" className="flex items-center gap-10">
          <NotificationButton />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
