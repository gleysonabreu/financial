import { IPermission } from '../DTOS/IPermission';
import { ICreatePermissionDTO } from '../useCases/createPermission/ICreatePermissionDTO';
import { IGetPermissionUserIdAndTypeDTO } from '../useCases/createPermission/IGetPermissionUserIdAndTypeDTO';

interface IPermissionsRepository {
  create: (permission: ICreatePermissionDTO) => Promise<IPermission>;
  findPermissionByUserIdAndType: (
    permission: IGetPermissionUserIdAndTypeDTO,
  ) => Promise<IPermission | undefined>;
  findById: (id: string) => Promise<IPermission | undefined>;
  delete: (permission: IPermission) => Promise<void>;
}

export { IPermissionsRepository };
