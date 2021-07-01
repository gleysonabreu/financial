import { IPermission } from '@modules/permissions/DTOS/IPermission';
import { Permission } from '@modules/permissions/infra/typeorm/entities/Permission';
import { ICreatePermissionDTO } from '@modules/permissions/useCases/createPermission/ICreatePermissionDTO';
import { IGetPermissionUserIdAndTypeDTO } from '@modules/permissions/useCases/createPermission/IGetPermissionUserIdAndTypeDTO';

import { IPermissionsRepository } from '../IPermissionsRepository';

class InMemoryPermissionsRepository implements IPermissionsRepository {
  private permissions: Permission[] = [];

  async create(permissionData: ICreatePermissionDTO): Promise<IPermission> {
    const permission = new Permission();
    Object.assign(permission, permissionData);
    this.permissions.push(permission);
    return permission;
  }

  async findPermissionByUserIdAndType({
    userId,
    type,
  }: IGetPermissionUserIdAndTypeDTO): Promise<IPermission | undefined> {
    return this.permissions.find(
      permission => permission.userId === userId && permission.type === type,
    );
  }

  async findById(id: string): Promise<IPermission | undefined> {
    return this.permissions.find(permission => permission.id === id);
  }

  async delete(permission: IPermission): Promise<void> {
    const removePermission = this.permissions.find(
      onePermission => onePermission.id === permission.id,
    );
    this.permissions.splice(this.permissions.indexOf(removePermission), 1);
  }
}

export { InMemoryPermissionsRepository };
