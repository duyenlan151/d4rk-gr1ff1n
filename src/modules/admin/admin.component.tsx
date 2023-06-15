/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { Outlet, useLocation, useMatch, useNavigate } from "react-router-dom";

function Admin() {
  const pattern = "/admin";
  const location = useLocation();
  const match = useMatch(pattern);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('rendered')

    if (match) {
      navigate("/admin/dashboard");
    }
  }, [location]);

  return (
    <>
      <p>admin here</p>
      <Outlet />
    </>
  );
}

export default Admin;
