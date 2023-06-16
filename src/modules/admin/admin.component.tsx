/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { Outlet, useLocation, useMatch, useNavigate } from "react-router-dom";

import Header from "../../shared/layout/header/admin-header.component";

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
    <div id="content-wrapper">
      <Header />
      <div id="content">
        <Outlet />
      </div>
    </div>
  );
}

export default Admin;
