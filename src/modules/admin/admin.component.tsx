/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { Link, Outlet, useLocation, useMatch, useNavigate } from "react-router-dom";

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
      <Link to="user-manager" relative="route">user manager</Link>
      <div id="content">
        <Outlet />
      </div>
    </div>
  );
}

export default Admin;
