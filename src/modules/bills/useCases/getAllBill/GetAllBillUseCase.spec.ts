import { IBillsRepository } from '@modules/bills/repositories/IBillsRepository';
import { InMemoryBills } from '@modules/bills/repositories/in-memory/InMemoryBills';

import { GetAllBillUseCase } from './GetAllBillUseCase';

let billsRepository: IBillsRepository;
let getAllBillUseCase: GetAllBillUseCase;

describe('GetOneBillUseCase', () => {
  beforeEach(() => {
    billsRepository = new InMemoryBills();
    getAllBillUseCase = new GetAllBillUseCase(billsRepository);
  });

  it('should be able to get all bills', async () => {
    const bill = await billsRepository.create({
      accountTypeId: '3d687d29-9a0d-4b2b-8012-f151682a661f',
      justification: 'Testing',
      date: '1998-02-21',
      value: 15,
    });

    const { bills } = await getAllBillUseCase.execute({});
    expect(bills).toEqual([bill]);
  });

  it('should be able to get all bills by account type id', async () => {
    const bill = await billsRepository.create({
      accountTypeId: '3d687d29-9a0d-4b2b-8012-f151682a661f',
      justification: 'Testing',
      date: '1998-02-21',
      value: 15,
    });

    const { bills } = await getAllBillUseCase.execute({
      accountTypeId: '3d687d29-9a0d-4b2b-8012-f151682a661f',
    });
    expect(bills).toEqual([bill]);
  });

  it('should be able to get all bills by justification', async () => {
    const bill = await billsRepository.create({
      accountTypeId: '3d687d29-9a0d-4b2b-8012-f151682a661f',
      justification: 'Testing',
      date: '1998-02-21',
      value: 15,
    });

    const { bills } = await getAllBillUseCase.execute({
      justification: 'ting',
    });
    expect(bills).toEqual([bill]);
  });

  it('should be able to get all bills by account type id and justification', async () => {
    const bill = await billsRepository.create({
      accountTypeId: '3d687d29-9a0d-4b2b-8012-f151682a661f',
      justification: 'Testing',
      date: '1998-02-21',
      value: 15,
    });

    await billsRepository.create({
      accountTypeId: '3d687d29-9a0d-4b2b-8012-f151682a662f',
      justification: 'Testing',
      date: '1998-02-21',
      value: 15,
    });

    const { bills } = await getAllBillUseCase.execute({
      justification: 'ting',
      accountTypeId: '3d687d29-9a0d-4b2b-8012-f151682a661f',
    });
    expect(bills).toEqual([bill]);
  });

  it('should be able to get all bills by date start and date finish', async () => {
    const bill = await billsRepository.create({
      accountTypeId: '3d687d29-9a0d-4b2b-8012-f151682a661f',
      justification: 'Testing',
      date: '1998-02-21',
      value: 15,
    });

    await billsRepository.create({
      accountTypeId: '3d687d29-9a0d-4b2b-8012-f151682a662f',
      justification: 'Testing',
      date: '1998-01-20',
      value: 15,
    });

    const { bills } = await getAllBillUseCase.execute({
      dateStart: '1998-02-20',
      dateFinish: '1998-02-28',
    });
    expect(bills).toEqual([bill]);
  });
});
