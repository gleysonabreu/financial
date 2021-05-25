import { AccountType } from '@modules/accountTypes/entities/AccountType';
import { IAccountTypesRepository } from '@modules/accountTypes/repositories/IAccountTypesRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { injectable, inject } from 'tsyringe';
import * as yup from 'yup';

import { IUpdateAccountTypeDTO } from './IUpdateAccountTypeDTO';
import { UpdateAccountTypeError } from './UpdateAccountTypeError';

@injectable()
class UpdateAccountTypeUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('AccountTypesRepository')
    private accountTypesRepository: IAccountTypesRepository,
  ) {}

  async execute({
    id,
    userId,
    name,
  }: IUpdateAccountTypeDTO): Promise<AccountType> {
    const schema = yup.object().shape({
      id: yup.string().uuid().required(),
      userId: yup.string().uuid().required(),
      name: yup.string().required(),
    });
    await schema.validate({ id, userId, name }, { abortEarly: false });

    const userAlreadyExists = await this.usersRepository.findById(userId);
    if (!userAlreadyExists) {
      throw new UpdateAccountTypeError.UserNotFound();
    }

    const accountType = await this.accountTypesRepository.findById(id);
    if (!accountType) {
      throw new UpdateAccountTypeError.AccountTypeNotFound();
    }

    const accountTypeByName = await this.accountTypesRepository.findByName(
      name,
    );
    if (accountTypeByName && accountTypeByName.name !== accountType.name) {
      throw new UpdateAccountTypeError.AccountTypeAlreadyExists();
    }

    accountType.name = name;
    const accountTypeUpdate = await this.accountTypesRepository.update(
      accountType,
    );
    return accountTypeUpdate;
  }
}

export { UpdateAccountTypeUseCase };
