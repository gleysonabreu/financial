import { IAccountType } from '@modules/accountTypes/DTOS/IAccountType';
import { AccountType } from '@modules/accountTypes/infra/typeorm/entities/AccountType';
import { ICreateAccountTypeDTO } from '@modules/accountTypes/useCases/createAccountType/CreateAccountTypeDTO';
import { IGetAllAccountTypeDTO } from '@modules/accountTypes/useCases/getAllAccountType/IGetAllAccountTypeDTO';

import { IAccountTypesRepository } from '../IAccountTypesRepository';

class InMemoryAccountTypesRepository implements IAccountTypesRepository {
  private accountTypes: AccountType[] = [];

  async findByName(name: string): Promise<IAccountType | undefined> {
    return this.accountTypes.find(accountType => accountType.name === name);
  }

  async create(accountTypeData: ICreateAccountTypeDTO): Promise<IAccountType> {
    const accountType = new AccountType();
    Object.assign(accountType, accountTypeData);
    this.accountTypes.push(accountType);
    return accountType;
  }

  async findById(id: string): Promise<IAccountType | undefined> {
    return this.accountTypes.find(accountType => accountType.id === id);
  }

  async delete(accountType: IAccountType): Promise<void> {
    const removeAccountType = this.accountTypes.filter(
      type => type.id !== accountType.id,
    );
    this.accountTypes = removeAccountType;
  }

  async update(accountType: IAccountType): Promise<IAccountType> {
    const findElement = this.accountTypes.findIndex(
      aT => aT.id === accountType.id,
    );
    this.accountTypes[findElement].name = accountType.name;
    this.accountTypes[findElement].createdAt = accountType.createdAt;
    this.accountTypes[findElement].updatedAt = accountType.updatedAt;

    return accountType;
  }

  async findAll({ name }: IGetAllAccountTypeDTO): Promise<IAccountType[]> {
    if (!name) {
      return this.accountTypes;
    }

    const allAccountTypes = this.accountTypes.filter(accountType =>
      accountType.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()),
    );

    return allAccountTypes;
  }
}

export { InMemoryAccountTypesRepository };
