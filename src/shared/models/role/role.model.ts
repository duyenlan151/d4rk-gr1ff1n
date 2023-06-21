import { ILoggedInUserRole } from "./role.interface";
import { Record, List } from "immutable";

export class LoggedInUserRole extends Record<ILoggedInUserRole>({
  name: "",
  permissions: List(),
}) {}
