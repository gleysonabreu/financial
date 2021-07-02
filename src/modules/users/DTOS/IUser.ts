import { IPermission } from '@modules/permissions/DTOS/IPermission';

interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  cpf: string;
  birthDate: string;
  avatar: string;
  phone: string;
  permissions: IPermission[];
  createdAt: Date;
  updatedAt: Date;
}

export { IUser };
