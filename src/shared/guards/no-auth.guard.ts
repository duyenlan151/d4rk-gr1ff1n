import { redirect } from "react-router-dom";

function noAuthGuard(): boolean {
  if (localStorage.getItem("accessToken")) {
    throw redirect("/");
  }

  return true;
}

export default noAuthGuard;
