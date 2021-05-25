import { IAccountTypesRepository } from '@modules/accountTypes/repositories/IAccountTypesRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';
import * as yup from 'yup';

import { DeleteAccountTypeError } from './DeleteAccountTypeError';
import { IDeleteAccountTypeDTO } from './IDeleteAccountTypeDTO';

@injectable()
class DeleteAccountTypeUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('AccountTypesRepository')
    private accountTypesRepository: IAccountTypesRepository,
  ) {}

  async execute({ id, userId }: IDeleteAccountTypeDTO): Promise<void> {
    const schema = yup.object().shape({
      id: yup.string().uuid().required(),
      userId: yup.string().uuid().required(),
    });
    await schema.validate({ id, userId }, { abortEarly: false });

    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new DeleteAccountTypeError.UserNotFound();
    }

    const accountType = await this.accountTypesRepository.findById(id);
    if (!accountType) {
      throw new DeleteAccountTypeError.AccountTypeNotFound();
    }

    await this.accountTypesRepository.delete(accountType);
  }
}

export { DeleteAccountTypeUseCase };
