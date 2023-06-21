import { ITransientBaseEntity } from "../base.entity";
import { IPermission } from "../permission/permission.entity";
import { IUser } from "../user/user.entity";

export interface IRole extends ITransientBaseEntity {
  name: string;
  description: string;
  enabled: boolean;
  createdBy: IUser;
  updatedBy: IUser;
  permissions: IPermission[];
}