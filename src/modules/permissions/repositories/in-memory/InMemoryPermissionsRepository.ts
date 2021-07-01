import { IPermission } from '@modules/permissions/DTOS/IPermission';
import { ICreatePermissionDTO } from '@modules/permissions/useCases/createPermission/ICreatePermissionDTO';
import { IGetPermissionUserIdAndTypeDTO } from '@modules/permissions/useCases/createPermission/IGetPermissionUserIdAndTypeDTO';
import { v4 as uuid } from 'uuid';

import { IPermissionsRepository } from '../IPermissionsRepository';

class InMemoryPermissionsRepository implements IPermissionsRepository {
  private permissions: IPermission[] = [];

  async create(permissionData: ICreatePermissionDTO): Promise<IPermission> {
    const permission = {
      ...permissionData,
      id: uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as IPermission;

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
