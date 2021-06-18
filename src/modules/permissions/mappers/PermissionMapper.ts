import { Permission } from '../entities/Permission';

type IResponse = {
  id: string;
  type: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
};

class PermissionMapper {
  static toMany(permissions: Permission[]): IResponse[] {
    return permissions.map(permission => this.toDTO(permission));
  }

  static toDTO({
    id,
    createdAt,
    type,
    updatedAt,
    userId,
  }: Permission): IResponse {
    return {
      id,
      type,
      user_id: userId,
      created_at: createdAt,
      updated_at: updatedAt,
    };
  }
}

export { PermissionMapper };
