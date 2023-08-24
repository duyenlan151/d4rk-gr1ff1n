import { IPreviewUser, ILoggedInUser, IDetailedUser } from "./user.interface";
import { List, Record } from "immutable";
import { DateTime } from "luxon";

const initRoleList = List<unknown>();

/**
 * Represents a user from the user list of the User Manager
 */
export class PreviewUser extends Record<IPreviewUser>({
  id: "",
  createTime: DateTime.now(),
  updateTime: DateTime.now(),
  email: "",
  username: "",
  roles: initRoleList,
}) {}

/**
 * Represents the logged in user
 */
export class LoggedInUser extends Record<ILoggedInUser>({
  username: "",
  roles: initRoleList,
}) {}

/**
 * Represents the user full information
 */
export class DetailedUser extends Record<IDetailedUser>({
  id: "",
  email: "",
  username: "",
  roles: initRoleList,
}) {}
