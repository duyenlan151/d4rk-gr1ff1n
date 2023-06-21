import { ILoggedInUserRoleDto } from "../role/role.dto";
import { IUser } from "./user.entity";

export interface IPreviewUserDto extends IUser {
  roles: string[];
}

export interface ILoggedInUserDto extends Pick<IUser, "username"> {
  roles: ILoggedInUserRoleDto[];
}

export interface IDetailedUserDto extends Pick<IUser, "username" | "email" | "id"> {
  roles: string[];
}
