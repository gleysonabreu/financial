import { User } from '../entities/User';

interface IResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cpf: string;
  birthDate: Date;
  phone: string;
  permissions: number[];
  createdAt: Date;
  updatedAt: Date;
}

class ProfileData {
  static toDTO({
    id,
    firstName,
    lastName,
    email,
    cpf,
    birthDate,
    phone,
    permissions,
    createdAt,
    updatedAt,
  }: User): IResponse {
    return {
      id,
      firstName,
      lastName,
      email,
      cpf,
      birthDate,
      phone,
      permissions: permissions.map(permission => permission.type),
      createdAt,
      updatedAt,
    };
  }
}

export { ProfileData };
