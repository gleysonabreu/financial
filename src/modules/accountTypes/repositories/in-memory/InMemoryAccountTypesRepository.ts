import { IAccountType } from '@modules/accountTypes/DTOS/IAccountType';
import { ICreateAccountTypeDTO } from '@modules/accountTypes/useCases/createAccountType/CreateAccountTypeDTO';
import { IGetAllAccountTypeDTO } from '@modules/accountTypes/useCases/getAllAccountType/IGetAllAccountTypeDTO';
import { v4 as uuid } from 'uuid';

import { IAccountTypesRepository } from '../IAccountTypesRepository';

class InMemoryAccountTypesRepository implements IAccountTypesRepository {
  private accountTypes: IAccountType[] = [];

  async findByName(name: string): Promise<IAccountType | undefined> {
    return this.accountTypes.find(accountType => accountType.name === name);
  }

  async create(accountTypeData: ICreateAccountTypeDTO): Promise<IAccountType> {
    const accountType = {
      ...accountTypeData,
      id: uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as IAccountType;

    this.accountTypes.push(accountType);
    return accountType;
  }

  async findById(id: string): Promise<IAccountType | undefined> {
    return this.accountTypes.find(accountType => accountType.id === id);
  }

  async delete(accountType: IAccountType): Promise<void> {
    const deleteAccountType = this.accountTypes.find(
      accountT => accountT.id === accountType.id,
    );
    this.accountTypes.splice(this.accountTypes.indexOf(deleteAccountType), 1);
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
