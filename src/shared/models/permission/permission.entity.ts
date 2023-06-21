import { IBaseEntity } from "../base.entity";

export interface IPermission extends IBaseEntity {
  name: string;
  description: string;
}
