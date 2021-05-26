import { Permission } from '@modules/permissions/entities/Permission';

import { User } from '../entities/User';

interface IResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cpf: string;
  birthDate: string;
  phone: string;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

class ProfileData {
  static toManyDTO(users: User[]): IResponse[] {
    return users.map(user => this.toDTO(user));
  }

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
      permissions,
      createdAt,
      updatedAt,
    };
  }
}

export { ProfileData };
