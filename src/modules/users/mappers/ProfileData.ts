import { Permission } from '@modules/permissions/infra/typeorm/entities/Permission';

import { User } from '../infra/typeorm/entities/User';

interface IResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  cpf: string;
  birth_date: string;
  phone: string;
  avatar: string;
  avatar_url: string;
  permissions: {
    id: string;
    user_id: string;
    type: string;
    created_at: Date;
    updated_at: Date;
  }[];
  created_at: Date;
  updated_at: Date;
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
      first_name: firstName,
      last_name: lastName,
      email,
      cpf,
      birth_date: birthDate,
      phone,
      avatar,
      avatar_url: this.convertToUrl(avatar),
      permissions: permissions?.map(permission => {
        return {
          id: permission.id,
          user_id: permission.userId,
          type: permission.type,
          created_at: permission.createdAt,
          updated_at: permission.updatedAt,
        };
      }),
      created_at: createdAt,
      updated_at: updatedAt,
    };
  }
}

export { ProfileData };
