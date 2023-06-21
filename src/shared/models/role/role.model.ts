import { ICompactRoleWithPermissionIds, ILoggedInUserRole } from "./role.interface";
import { Record, List } from "immutable";

export class LoggedInUserRole extends Record<ILoggedInUserRole>({
  name: "",
  permissions: List(),
}) {}

export class CompactRole extends Record<ICompactRoleWithPermissionIds>({
  id: "",
  name: "",
  permissions: List(),
}) {}
