import { IPermission } from '@modules/permissions/DTOS/IPermission';
import { IPermissionsRepository } from '@modules/permissions/repositories/IPermissionsRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';
import * as yup from 'yup';

import { validPermissions } from '@shared/utils/validPermissions';

import { CreatePermissionError } from './CreatePermissionError';
import { ICreatePermissionDTO } from './ICreatePermissionDTO';

@injectable()
class CreatePermissionsUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('PermissionsRepository')
    private permissionsRepository: IPermissionsRepository,
  ) {}

  async execute({ userId, type }: ICreatePermissionDTO): Promise<IPermission> {
    const schema = yup.object().shape({
      user_id: yup.string().uuid().required(),
      type: yup.string().required(),
    });
    await schema.validate({ user_id: userId, type }, { abortEarly: false });

    if (!validPermissions(type)) {
      throw new CreatePermissionError.PermissionNotExist();
    }

    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new CreatePermissionError.UserNotFound();
    }

    const permissionAlreadyExists = await this.permissionsRepository.findPermissionByUserIdAndType(
      {
        userId,
        type,
      },
    );
    if (permissionAlreadyExists) {
      throw new CreatePermissionError.PermissionAlreadyExistsError();
    }

    const permission = await this.permissionsRepository.create({
      userId,
      type,
    });
    return permission;
  }
}

export { CreatePermissionsUseCase };
