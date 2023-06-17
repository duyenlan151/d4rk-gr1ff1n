/* eslint-disable react-hooks/exhaustive-deps */
import "./admin.component.scss";

import { Outlet, useLocation, useMatch, useNavigate } from "react-router-dom";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { useEffect } from "react";

// Components
import Header from "../../shared/layout/header/admin-header.component";
import BreadcrumbsContainer from "../../shared/components/breadcrumbs/breadcrumbs.component";
import SideNav from "../../shared/components/side-nav/side-nav.component";
import Transition from "../../shared/components/transition/transition.component";

function Admin() {
  const pattern = "/admin";
  const location = useLocation();
  const match = useMatch(pattern);
  const navigate = useNavigate();

  useEffect(() => {
    if (match) {
      navigate("/admin/dashboard");
    }
  }, [location]);

  return (
    <div id="content-wrapper" className="admin-wrapper bg-[#F1F1F1] min-h-screen">
      <div id="header-container" className="w-full shadow-md z-10 shadow-slate-500/30">
        <Header />
      </div>
      <OverlayScrollbarsComponent defer id="content">
        <div className="w-full h-full items-center flex flex-col items-center">
          <div className="container flex h-full gap-4">
            <div id="sidebar-container">
              <SideNav />
            </div>
            <div id="content-container" className="flex-1">
              <div className="w-full flex flex-col items-center h-full">
                <div className="flex items-center container h-14 w-full">
                  <BreadcrumbsContainer />
                </div>
                <div className="container bg-white p-3.5 h-full shadow-md shadow-grey-500 rounded-md">
                  <Transition>
                    <Outlet />
                  </Transition>
                </div>
              </div>
            </div>
          </div>
        </div>
      </OverlayScrollbarsComponent>
    </div>
  );
}

export default Admin;
