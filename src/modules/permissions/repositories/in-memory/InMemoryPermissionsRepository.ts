import { Permission } from '@modules/permissions/entities/Permission';
import { ICreatePermissionDTO } from '@modules/permissions/useCases/createPermission/ICreatePermissionDTO';
import { IGetPermissionUserIdAndTypeDTO } from '@modules/permissions/useCases/createPermission/IGetPermissionUserIdAndTypeDTO';

import { IPermissionsRepository } from '../IPermissionsRepository';

class InMemoryPermissionsRepository implements IPermissionsRepository {
  private permissions: Permission[] = [];

  async create(permissionData: ICreatePermissionDTO): Promise<Permission> {
    const permission = new Permission();
    Object.assign(permission, permissionData);
    this.permissions.push(permission);
    return permission;
  }

  async findPermissionByUserIdAndType({
    userId,
    type,
  }: IGetPermissionUserIdAndTypeDTO): Promise<Permission | undefined> {
    return this.permissions.find(
      permission => permission.userId === userId && permission.type === type,
    );
  }

  async findById(id: string): Promise<Permission | undefined> {
    return this.permissions.find(permission => permission.id === id);
  }

  async delete(permission: Permission): Promise<void> {
    const removePermission = this.permissions.filter(
      permissionArray => permissionArray.id !== permission.id,
    );
    this.permissions = removePermission;
  }
}

export { InMemoryPermissionsRepository };
