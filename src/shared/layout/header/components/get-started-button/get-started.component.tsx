import { East } from "@mui/icons-material";
import { Link } from "react-router-dom";

function GetStartedButton() {
  return (
    <Link to="/sign-up">
      <div id="get-started" className="bg-emerald-700 rounded-3xl p-2 px-4 text-white flex gap-1 items-center shadow-md shadow-emerald-700/50">
        <span>Get Started</span> <East fontSize="inherit" />
      </div>
    </Link>
  );
}

export default GetStartedButton;
