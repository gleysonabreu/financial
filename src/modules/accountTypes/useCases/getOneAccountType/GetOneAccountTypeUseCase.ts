import { IAccountType } from '@modules/accountTypes/DTOS/IAccountType';
import { IAccountTypesRepository } from '@modules/accountTypes/repositories/IAccountTypesRepository';
import { inject, injectable } from 'tsyringe';
import * as yup from 'yup';

import { AccountTypeNotFound } from './GetOneAccountTypeError';
import { IGetOneAccountType } from './IGetOneAccountType';

@injectable()
class GetOneAccountTypeUseCase {
  constructor(
    @inject('AccountTypesRepository')
    private accountTypesRepository: IAccountTypesRepository,
  ) {}

  async execute({ id }: IGetOneAccountType): Promise<IAccountType> {
    const schema = yup.object().shape({
      id: yup.string().uuid().required(),
    });
    await schema.validate({ id }, { abortEarly: false });

    const accountType = await this.accountTypesRepository.findById(id);
    if (!accountType) {
      throw new AccountTypeNotFound();
    }

    return accountType;
  }
}

export { GetOneAccountTypeUseCase };
