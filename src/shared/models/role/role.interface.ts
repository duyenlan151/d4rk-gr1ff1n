import { ICompactRoleWithPermissionIdsDto, ILoggedInUserRoleDto } from "./role.dto";
import { List } from "immutable";

export interface ICompactRoleWithPermissionIds extends Omit<ICompactRoleWithPermissionIdsDto, "permissions"> {
  permissions: string[];
}

export interface ILoggedInUserRole extends Omit<ILoggedInUserRoleDto, "permissions"> {
  permissions: List<string>;
}
