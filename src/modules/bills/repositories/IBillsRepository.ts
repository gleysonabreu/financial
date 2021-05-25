import { Bill } from '../entities/Bill';
import { ICreateBillDTO } from '../useCases/createBill/ICreateBillDTO';
import { IGetAllBillDTO } from '../useCases/getAllBill/IGetAllBillDTO';

interface IBillsRepository {
  create(bill: ICreateBillDTO): Promise<Bill>;
  findById(id: string): Promise<Bill | undefined>;
  save(bill: Bill): Promise<Bill>;
  delete(bill: Bill): Promise<void>;
  findAll(filters?: IGetAllBillDTO): Promise<Bill[]>;
}

export { IBillsRepository };
