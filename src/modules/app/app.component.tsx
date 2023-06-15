import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./app.component.scss";

import { Outlet } from "react-router-dom";

import Header from "../../shared/layout/header/header.component";
import Footer from "../../shared/layout/footer/footer.component";

function App() {
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
