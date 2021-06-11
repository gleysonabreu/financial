import { AccountType } from '../entities/AccountType';
import { ICreateAccountTypeDTO } from '../useCases/createAccountType/CreateAccountTypeDTO';
import { IGetAllAccountTypeDTO } from '../useCases/getAllAccountType/IGetAllAccountTypeDTO';

interface IAccountTypesRepository {
  create(accountType: ICreateAccountTypeDTO): Promise<AccountType>;
  findByName: (name: string) => Promise<AccountType | undefined>;
  findById: (id: string) => Promise<AccountType | undefined>;
  delete: (accountType: AccountType) => Promise<void>;
  update: (accountType: AccountType) => Promise<AccountType>;
  findAll: (filters?: IGetAllAccountTypeDTO) => Promise<AccountType[]>;
}

export { IAccountTypesRepository };
