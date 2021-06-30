import { IAccountType } from '@modules/accountTypes/DTOS/IAccountType';
import { IAccountTypesRepository } from '@modules/accountTypes/repositories/IAccountTypesRepository';
import { inject, injectable } from 'tsyringe';
import * as yup from 'yup';

import { ICreateAccountTypeDTO } from './CreateAccountTypeDTO';
import { AccountTypeAlreadyExists } from './CreateAccountTypeError';

@injectable()
class CreateAccountTypeUseCase {
  constructor(
    @inject('AccountTypesRepository')
    private accountTypesRepository: IAccountTypesRepository,
  ) {}
  async execute({ name }: ICreateAccountTypeDTO): Promise<IAccountType> {
    const schema = yup.object().shape({
      name: yup.string().min(3).required(),
    });
    await schema.validate({ name }, { abortEarly: false });

    const accountTypeAlreadyExists = await this.accountTypesRepository.findByName(
      name,
    );
    if (accountTypeAlreadyExists) {
      throw new AccountTypeAlreadyExists();
    }

    const accountType = await this.accountTypesRepository.create({ name });
    return accountType;
  }
}

export { CreateAccountTypeUseCase };
