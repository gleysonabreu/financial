import { IAccountTypesRepository } from '@modules/accountTypes/repositories/IAccountTypesRepository';
import { InMemoryAccountTypesRepository } from '@modules/accountTypes/repositories/in-memory/InMemoryAccountTypesRepository';
import { IBillsRepository } from '@modules/bills/repositories/IBillsRepository';
import { InMemoryBills } from '@modules/bills/repositories/in-memory/InMemoryBills';

import { UpdateBillError } from './UpdateBillError';
import { UpdateBillUseCase } from './UpdateBillUseCase';

let accountTypesRepository: IAccountTypesRepository;
let billsRepository: IBillsRepository;
let updateBillUseCase: UpdateBillUseCase;

describe('UpdateBillUseCase', () => {
  beforeEach(() => {
    accountTypesRepository = new InMemoryAccountTypesRepository();
    billsRepository = new InMemoryBills();
    updateBillUseCase = new UpdateBillUseCase(
      accountTypesRepository,
      billsRepository,
    );
  });

  it('should be able to update a bill', async () => {
    const accountType = await accountTypesRepository.create({
      name: 'test',
    });
    const bill = await billsRepository.create({
      accountTypeId: accountType.id,
      justification: 'Test',
      date: '1998-02-21',
      value: 15.5,
    });

    const response = await updateBillUseCase.execute({
      accountTypeId: accountType.id,
      id: bill.id,
      justification: 'Testing update bill',
      value: 150,
    });

    expect(response).toEqual(
      expect.objectContaining({
        accountTypeId: accountType.id,
        id: bill.id,
        justification: 'Testing update bill',
        date: '1998-02-21',
        value: 150,
      }),
    );
  });

  it('should not be able update a bill if account type does not exists', async () => {
    const accountType = await accountTypesRepository.create({
      name: 'test',
    });
    const bill = await billsRepository.create({
      accountTypeId: accountType.id,
      justification: 'testing testing testing',
      date: '1998-02-21',
      value: 15.5,
    });

    await expect(async () => {
      await updateBillUseCase.execute({
        accountTypeId: '33973ab3-3ab3-4eb1-ad1d-9c52b3facc1a',
        id: bill.id,
        justification: 'testing testing testing',
        value: 10.6,
      });
    }).rejects.toBeInstanceOf(UpdateBillError.AccountTypeNotFound);
  });

  it('should not be able to update a bill if bill not exist', async () => {
    const accountType = await accountTypesRepository.create({
      name: 'test',
    });

    await expect(async () => {
      await updateBillUseCase.execute({
        accountTypeId: accountType.id,
        id: '33973ab3-3ab3-4eb1-ad1d-9c52b3facc1a',
        justification: 'testing update',
        value: 10,
      });
    }).rejects.toBeInstanceOf(UpdateBillError.BillNotFound);
  });
});
