interface IPermission {
  id: string;
  userId: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

export { IPermission };
