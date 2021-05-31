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
  avatar: string;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

class ProfileData {
  static toManyDTO(users: User[]): IResponse[] {
    return users.map(user => this.toDTO(user));
  }

  static convertToUrl(avatar: string): string {
    switch (process.env.STORAGE_PROVIDER) {
      case 'local':
        return `${process.env.APP_API_URL}/${process.env.STORAGE_FOLDER}/${avatar}`;
      default:
        return null;
    }
  }

  static toDTO({
    id,
    firstName,
    lastName,
    email,
    cpf,
    birthDate,
    phone,
    avatar,
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
      avatar: this.convertToUrl(avatar),
      permissions,
      createdAt,
      updatedAt,
    };
  }
}

export { ProfileData };
