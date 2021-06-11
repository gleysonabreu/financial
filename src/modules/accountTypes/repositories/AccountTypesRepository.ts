import { getRepository, Repository } from 'typeorm';

import { AccountType } from '../entities/AccountType';
import { ICreateAccountTypeDTO } from '../useCases/createAccountType/CreateAccountTypeDTO';
import { IGetAllAccountTypeDTO } from '../useCases/getAllAccountType/IGetAllAccountTypeDTO';
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

  async findAll({
    name,
    page,
    per_page: perPage,
  }: IGetAllAccountTypeDTO): Promise<AccountType[]> {
    const accountTypeQuery = await this.repository
      .createQueryBuilder('account_type')
      .take(perPage)
      .skip(page);

    if (name) {
      accountTypeQuery.andWhere('name LIKE :name', {
        name: `%${name}%`,
      });
    }

    const accountTypes = await accountTypeQuery.getMany();
    return accountTypes;
  }
}

export { AccountTypesRepository };
