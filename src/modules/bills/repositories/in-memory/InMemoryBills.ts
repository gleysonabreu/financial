import { IBill } from '@modules/bills/DTOS/IBill';
import { Bill } from '@modules/bills/infra/typeorm/entities/Bill';
import { ICreateBillDTO } from '@modules/bills/useCases/createBill/ICreateBillDTO';
import { IGetAllBillDTO } from '@modules/bills/useCases/getAllBill/IGetAllBillDTO';

import { IBillsRepository } from '../IBillsRepository';

class InMemoryBills implements IBillsRepository {
  private bills: Bill[] = [];

  async create(data: ICreateBillDTO): Promise<IBill> {
    const bill = new Bill();
    Object.assign(bill, data);
    this.bills.push(bill);
    return bill;
  }

  async findById(id: string): Promise<IBill | undefined> {
    return this.bills.find(bill => bill.id === id);
  }

  async save(billUpdate: IBill): Promise<IBill> {
    const findElement = this.bills.findIndex(bill => bill.id === billUpdate.id);
    this.bills[findElement].accountTypeId = billUpdate.accountTypeId;
    this.bills[findElement].justification = billUpdate.justification;
    this.bills[findElement].value = billUpdate.value;

    return billUpdate;
  }

  async delete(billRemove: IBill): Promise<void> {
    const removedBill = this.bills.filter(bill => bill.id !== billRemove.id);
    this.bills = removedBill;
  }

  async findAll({
    accountTypeId,
    justification,
    dateFinish,
    dateStart,
  }: IGetAllBillDTO): Promise<IBill[]> {
    if (!accountTypeId && !justification && !dateStart && !dateFinish) {
      return this.bills;
    }

    const allBills = this.bills.filter(bill => {
      if (
        accountTypeId &&
        bill.accountTypeId === accountTypeId &&
        !justification &&
        !dateStart &&
        !dateFinish
      ) {
        return bill;
      }

      if (
        justification &&
        bill.justification
          .toLocaleLowerCase()
          .includes(justification.toLowerCase()) &&
        !accountTypeId &&
        !dateStart &&
        !dateFinish
      ) {
        return bill;
      }

      if (
        dateStart &&
        dateFinish &&
        new Date(bill.date).getTime() >= new Date(dateStart).getTime() &&
        new Date(bill.date).getTime() <= new Date(dateFinish).getTime() &&
        !justification &&
        !accountTypeId
      ) {
        return bill;
      }

      if (
        accountTypeId &&
        bill.accountTypeId === accountTypeId &&
        justification &&
        bill.justification
          .toLocaleLowerCase()
          .includes(justification.toLowerCase())
      ) {
        return bill;
      }

      return null;
    });

    return allBills;
  }
}

export { InMemoryBills };
