export enum Constants {
  LOCAL_STORAGE_CREDENTIALS = "credentials",
  LOCAL_STORAGE_TOKEN = "accessToken",
  LOCAL_STORAGE_USERNAME = "currentUser",
  ROUTER_SNAPSHOT_PARAM_REDIRECT = "redirectPath",
}

export enum AppPermission {
  COMMISSION_READ = "commission.read",
  COMMISSION_MODIFY = "commission.modify",
  COMMISSION_DELETE = "commission.delete",

  COMMISSION_TYPE_READ = "commission-type.read",
  COMMISSION_TYPE_MODIFY = "commission-type.modify",
  COMMISSION_TYPE_DELETE = "commission-type.delete",

  USER_READ = "user.read",
  USER_MODIFY = "user.modify",
  USER_DELETE = "user.delete",

  ROLE_READ = "role.read",
  ROLE_MODIFY = "role.modify",
  ROLE_DELETE = "role.delete",

  PERMISSION_READ = "permission.read",
}
