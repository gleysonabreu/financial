import { getRepository, Repository } from 'typeorm';

import { Bill } from '../entities/Bill';
import { ICreateBillDTO } from '../useCases/createBill/ICreateBillDTO';
import { IGetAllBillDTO } from '../useCases/getAllBill/IGetAllBillDTO';
import { IBillsRepository } from './IBillsRepository';

class BillsRepository implements IBillsRepository {
  private repository: Repository<Bill>;

  constructor() {
    this.repository = getRepository(Bill);
  }

  async create(data: ICreateBillDTO): Promise<Bill> {
    const bill = this.repository.create(data);
    return this.repository.save(bill);
  }

  async findById(id: string): Promise<Bill | undefined> {
    return this.repository.findOne({ id });
  }

  async save(bill: Bill): Promise<Bill> {
    return this.repository.save(bill);
  }

  async delete(bill: Bill): Promise<void> {
    await this.repository.remove(bill);
  }

  async findAll({
    take,
    skip,
    justification,
    accountTypeId,
    dateFinish,
    dateStart,
  }: IGetAllBillDTO): Promise<Bill[]> {
    const billsQuery = await this.repository
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.accountType', 'accountType')
      .take(take)
      .skip(skip);

    if (accountTypeId) {
      billsQuery.andWhere('account_type_id = :accountTypeId', {
        accountTypeId,
      });
    }

    if (justification) {
      billsQuery.andWhere('justification LIKE :justification', {
        justification: `%${justification}%`,
      });
    }

    if (dateStart && dateFinish) {
      billsQuery.andWhere('date BETWEEN :dateStart AND :dateFinish', {
        dateStart,
        dateFinish,
      });
    }

    const bills = await billsQuery.getMany();
    return bills;
  }
}

export { BillsRepository };
