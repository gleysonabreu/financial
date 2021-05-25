import { Bill } from '@modules/bills/entities/Bill';
import { ICreateBillDTO } from '@modules/bills/useCases/createBill/ICreateBillDTO';
import { IGetAllBillDTO } from '@modules/bills/useCases/getAllBill/IGetAllBillDTO';

import { IBillsRepository } from '../IBillsRepository';

class InMemoryBills implements IBillsRepository {
  private bills: Bill[] = [];

  async create(data: ICreateBillDTO): Promise<Bill> {
    const bill = new Bill();
    Object.assign(bill, data);
    this.bills.push(bill);
    return bill;
  }

  async findById(id: string): Promise<Bill | undefined> {
    return this.bills.find(bill => bill.id === id);
  }

  async save(billUpdate: Bill): Promise<Bill> {
    const bills = this.bills.map(bill => {
      if (bill.id === billUpdate.id) {
        return billUpdate;
      }

      return bill;
    });
    this.bills = bills;
    return billUpdate;
  }

  async delete(billRemove: Bill): Promise<void> {
    const removedBill = this.bills.filter(bill => bill.id !== billRemove.id);
    this.bills = removedBill;
  }

  async findAll({
    accountTypeId,
    justification,
  }: IGetAllBillDTO): Promise<Bill[]> {
    if (!accountTypeId && !justification) {
      return this.bills;
    }

    const allBills = this.bills.filter(bill => {
      if (
        accountTypeId &&
        bill.accountTypeId === accountTypeId &&
        !justification
      ) {
        return bill;
      }

      if (
        justification &&
        bill.justification
          .toLocaleLowerCase()
          .includes(justification.toLowerCase()) &&
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
