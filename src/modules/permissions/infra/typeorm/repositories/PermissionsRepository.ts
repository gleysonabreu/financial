import { getRepository, Repository } from 'typeorm';

import { IPermissionsRepository } from '../../../repositories/IPermissionsRepository';
import { ICreatePermissionDTO } from '../../../useCases/createPermission/ICreatePermissionDTO';
import { IGetPermissionUserIdAndTypeDTO } from '../../../useCases/createPermission/IGetPermissionUserIdAndTypeDTO';
import { Permission } from '../entities/Permission';

class PermissionsRepository implements IPermissionsRepository {
  private repository: Repository<Permission>;

  constructor() {
    this.repository = getRepository(Permission);
  }

  async create(permissionData: ICreatePermissionDTO): Promise<Permission> {
    const permission = this.repository.create(permissionData);
    return this.repository.save(permission);
  }

  async findPermissionByUserIdAndType({
    userId,
    type,
  }: IGetPermissionUserIdAndTypeDTO): Promise<Permission | undefined> {
    return this.repository.findOne({
      where: {
        userId,
        type,
      },
    });
  }

  async findById(id: string): Promise<Permission | undefined> {
    return this.repository.findOne(id);
  }

  async delete(permission: Permission): Promise<void> {
    await this.repository.remove(permission);
  }
}

export { PermissionsRepository };
