export interface IBaseEntity {
  id: string;
}

export interface ITransientBaseEntity extends IBaseEntity {
  createTime: string;
  updateTime: string;
}