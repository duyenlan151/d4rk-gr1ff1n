import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./app.component.scss";

import { Outlet, useLocation, useMatch, useNavigate } from "react-router-dom";

import Header from "../../shared/layout/header/header.component";
import Footer from "../../shared/layout/footer/footer.component";
import { useEffect } from "react";

function App() {
  const pattern = "/";
  const location = useLocation();
  const match = useMatch(pattern);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('rendered')

    if (match) {
      navigate("/home");
    }
  }, [location]);

  return (
    <div id="content-wrapper">
      <Header />
      <div>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default App;
