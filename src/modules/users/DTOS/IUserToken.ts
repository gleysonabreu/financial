import { IUser } from './IUser';

interface IUserToken {
  id: string;
  token: string;
  userId: string;
  user: IUser;
  expireDate: Date;
  createdAt: Date;
}

export { IUserToken };
