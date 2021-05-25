import { AccountType } from '../entities/AccountType';
import { ICreateAccountTypeDTO } from '../useCases/createAccountType/CreateAccountTypeDTO';

interface IAccountTypesRepository {
  create(accountType: ICreateAccountTypeDTO): Promise<AccountType>;
  findByName: (name: string) => Promise<AccountType | undefined>;
  findById: (id: string) => Promise<AccountType | undefined>;
  delete: (accountType: AccountType) => Promise<void>;
  update: (accountType: AccountType) => Promise<AccountType>;
  findAll: () => Promise<AccountType[]>;
}

export { IAccountTypesRepository };
