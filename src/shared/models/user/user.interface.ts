import { IDetailedUserDto, IPreviewUserDto } from "./user.dto";
import { LoggedInUserRole } from "../role/role.model";
import { DateTime } from "luxon";
import { IUser } from "./user.entity";
import { List } from "immutable";

export interface IPreviewUser extends Omit<IPreviewUserDto, "roles" | "createTime" | "updateTime"> {
  createTime: DateTime;
  updateTime: DateTime;
  roles: List<string>;
}

export interface ILoggedInUser extends Pick<IUser, "username"> {
  roles: List<LoggedInUserRole>;
}

export interface IDetailedUser extends Omit<IDetailedUserDto, "roles"> {
  roles: List<string>;
}