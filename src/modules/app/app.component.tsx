import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./app.component.scss";

import { Outlet, useLocation, useMatch, useNavigate } from "react-router-dom";
import { useUserContext, useUserProvider } from "../../shared/providers/user.provider";
import { useEffect } from "react";
import { forkJoin } from "rxjs";

import Header from "../../shared/layout/header/header.component";
import Footer from "../../shared/layout/footer/footer.component";

function App() {
  const pattern = "/";
  const match = useMatch(pattern);
  const navigate = useNavigate();
  const location = useLocation();
  
  const { getPermissionList, getRoleList } = useUserProvider();
  const { user } = useUserContext();

  useEffect(() => {
    if (location.state?._isRedirect) {
      forkJoin([getPermissionList(), getRoleList()]).subscribe(
        ([permissions, roles]) => {
          user.value = user.value?.withMutations((_user) =>
            _user.set("permissions", permissions).set("roles", roles)
          );
        }
      );
    }

    if (match) {
      navigate("/home");
    }
  });

  return (
    <div id="content-wrapper">
      <Header />
      <div id="content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default App;
