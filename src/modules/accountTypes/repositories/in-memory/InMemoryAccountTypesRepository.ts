import { AccountType } from '@modules/accountTypes/entities/AccountType';
import { ICreateAccountTypeDTO } from '@modules/accountTypes/useCases/createAccountType/CreateAccountTypeDTO';
import { IGetAllAccountTypeDTO } from '@modules/accountTypes/useCases/getAllAccountType/IGetAllAccountTypeDTO';

import { IAccountTypesRepository } from '../IAccountTypesRepository';

class InMemoryAccountTypesRepository implements IAccountTypesRepository {
  private accountTypes: AccountType[] = [];

  async findByName(name: string): Promise<AccountType | undefined> {
    return this.accountTypes.find(accountType => accountType.name === name);
  }

  async create(accountTypeData: ICreateAccountTypeDTO): Promise<AccountType> {
    const accountType = new AccountType();
    Object.assign(accountType, accountTypeData);
    this.accountTypes.push(accountType);
    return accountType;
  }

  async findById(id: string): Promise<AccountType | undefined> {
    return this.accountTypes.find(accountType => accountType.id === id);
  }

  async delete(accountType: AccountType): Promise<void> {
    const removeAccountType = this.accountTypes.filter(
      type => type.id !== accountType.id,
    );
    this.accountTypes = removeAccountType;
  }

  async update(accountType: AccountType): Promise<AccountType> {
    const accountTypeUpdate = this.accountTypes.map(aT => {
      if (aT.id === accountType.id) {
        return accountType;
      }

      return aT;
    });
    this.accountTypes = accountTypeUpdate;
    return accountType;
  }

  async findAll({ name }: IGetAllAccountTypeDTO): Promise<AccountType[]> {
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
