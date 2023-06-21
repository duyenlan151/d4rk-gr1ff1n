import { ITransientBaseEntity } from "../base.entity";

export interface IUser extends ITransientBaseEntity {
  username: string;
  email: string;
}
