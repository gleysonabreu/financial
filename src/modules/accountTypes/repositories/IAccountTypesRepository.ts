import { IAccountType } from '../DTOS/IAccountType';
import { ICreateAccountTypeDTO } from '../useCases/createAccountType/CreateAccountTypeDTO';
import { IGetAllAccountTypeDTO } from '../useCases/getAllAccountType/IGetAllAccountTypeDTO';

interface IAccountTypesRepository {
  create(accountType: ICreateAccountTypeDTO): Promise<IAccountType>;
  findByName: (name: string) => Promise<IAccountType | undefined>;
  findById: (id: string) => Promise<IAccountType | undefined>;
  delete: (accountType: IAccountType) => Promise<void>;
  update: (accountType: IAccountType) => Promise<IAccountType>;
  findAll: (filters?: IGetAllAccountTypeDTO) => Promise<IAccountType[]>;
}

export { IAccountTypesRepository };
