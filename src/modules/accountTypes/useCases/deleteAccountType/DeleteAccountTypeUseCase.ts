import { IAccountTypesRepository } from '@modules/accountTypes/repositories/IAccountTypesRepository';
import { inject, injectable } from 'tsyringe';
import * as yup from 'yup';

import { AccountTypeNotFound } from './DeleteAccountTypeError';
import { IDeleteAccountTypeDTO } from './IDeleteAccountTypeDTO';

@injectable()
class DeleteAccountTypeUseCase {
  constructor(
    @inject('AccountTypesRepository')
    private accountTypesRepository: IAccountTypesRepository,
  ) {}

  async execute({ id }: IDeleteAccountTypeDTO): Promise<void> {
    const schema = yup.object().shape({
      id: yup.string().uuid().required(),
    });
    await schema.validate({ id }, { abortEarly: false });

    const accountType = await this.accountTypesRepository.findById(id);
    if (!accountType) {
      throw new AccountTypeNotFound();
    }

    await this.accountTypesRepository.delete(accountType);
  }
}

export { DeleteAccountTypeUseCase };
