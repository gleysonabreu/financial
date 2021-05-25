import { IPermissionsRepository } from '@modules/permissions/repositories/IPermissionsRepository';
import { inject, injectable } from 'tsyringe';
import * as yup from 'yup';

import { DeletePermissionError } from './DeletePermissionError';
import { IDeletePermissionDTO } from './IDeletePermissionDTO';

@injectable()
class DeletePermissionUseCase {
  constructor(
    @inject('PermissionsRepository')
    private permissionsRepository: IPermissionsRepository,
  ) {}

  async execute({ id }: IDeletePermissionDTO): Promise<void> {
    const schema = yup.object().shape({
      id: yup.string().uuid().required(),
    });
    await schema.validate({ id }, { abortEarly: false });

    const permission = await this.permissionsRepository.findById(id);
    if (!permission) {
      throw new DeletePermissionError();
    }

    await this.permissionsRepository.delete(permission);
  }
}

export { DeletePermissionUseCase };
