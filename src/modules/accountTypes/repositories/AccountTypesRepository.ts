import { getRepository, Repository } from 'typeorm';

import { AccountType } from '../entities/AccountType';
import { ICreateAccountTypeDTO } from '../useCases/createAccountType/CreateAccountTypeDTO';
import { IAccountTypesRepository } from './IAccountTypesRepository';

class AccountTypesRepository implements IAccountTypesRepository {
  private repository: Repository<AccountType>;

  constructor() {
    this.repository = getRepository(AccountType);
  }

  async findByName(name: string): Promise<AccountType | undefined> {
    return this.repository.findOne({ name });
  }

  async create({ name }: ICreateAccountTypeDTO): Promise<AccountType> {
    const accountType = this.repository.create({ name });
    return this.repository.save(accountType);
  }

  async findById(id: string): Promise<AccountType | undefined> {
    return this.repository.findOne({ id });
  }

  async delete(accountType: AccountType): Promise<void> {
    await this.repository.remove(accountType);
  }

  async update(accountType: AccountType): Promise<AccountType> {
    return this.repository.save(accountType);
  }

  async findAll(): Promise<AccountType[]> {
    return this.repository.find();
  }
}

export { AccountTypesRepository };
