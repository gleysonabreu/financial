import { Permission } from '../entities/Permission';
import { ICreatePermissionDTO } from '../useCases/createPermission/ICreatePermissionDTO';
import { IGetPermissionUserIdAndTypeDTO } from '../useCases/createPermission/IGetPermissionUserIdAndTypeDTO';

interface IPermissionsRepository {
  create: (permission: ICreatePermissionDTO) => Promise<Permission>;
  findPermissionByUserIdAndType: (
    permission: IGetPermissionUserIdAndTypeDTO,
  ) => Promise<Permission | undefined>;
  findById: (id: string) => Promise<Permission | undefined>;
  delete: (permission: Permission) => Promise<void>;
}

export { IPermissionsRepository };
