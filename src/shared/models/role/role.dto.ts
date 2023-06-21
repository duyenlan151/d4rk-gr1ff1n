import { IPermission } from "../permission/permission.entity";
import { IRole } from "./role.entity";

export interface ICompactRoleWithPermissionIdsDto extends Pick<IRole, "id" | "name"> {
  permissions: Pick<IPermission, "id">[];
}

export interface ILoggedInUserRoleDto extends Pick<IRole, "name"> {
  permissions: Pick<IPermission, "id" | "name">[];
}

export type IRoleDto = ICompactRoleWithPermissionIdsDto;
