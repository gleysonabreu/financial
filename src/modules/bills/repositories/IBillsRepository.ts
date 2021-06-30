import { IBill } from '../DTOS/IBill';
import { ICreateBillDTO } from '../useCases/createBill/ICreateBillDTO';
import { IGetAllBillDTO } from '../useCases/getAllBill/IGetAllBillDTO';

interface IBillsRepository {
  create(bill: ICreateBillDTO): Promise<IBill>;
  findById(id: string): Promise<IBill | undefined>;
  save(bill: IBill): Promise<IBill>;
  delete(bill: IBill): Promise<void>;
  findAll(filters?: IGetAllBillDTO): Promise<IBill[]>;
}

export { IBillsRepository };
