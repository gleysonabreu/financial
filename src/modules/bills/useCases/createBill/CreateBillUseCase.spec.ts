import { IAccountTypesRepository } from '@modules/accountTypes/repositories/IAccountTypesRepository';
import { InMemoryAccountTypesRepository } from '@modules/accountTypes/repositories/in-memory/InMemoryAccountTypesRepository';
import { IBillsRepository } from '@modules/bills/repositories/IBillsRepository';
import { InMemoryBills } from '@modules/bills/repositories/in-memory/InMemoryBills';

import { CreateBillError } from './CreateBillError';
import { CreateBillUseCase } from './CreateBillUseCase';

let accountTypesRepository: IAccountTypesRepository;
let billsRepository: IBillsRepository;
let createBillUseCase: CreateBillUseCase;

describe('CreateBillUseCase', () => {
  beforeEach(() => {
    accountTypesRepository = new InMemoryAccountTypesRepository();
    billsRepository = new InMemoryBills();
    createBillUseCase = new CreateBillUseCase(
      accountTypesRepository,
      billsRepository,
    );
  });

  it('should not be able to create a bill if account type does not exist', async () => {
    await expect(async () => {
      await createBillUseCase.execute({
        accountTypeId: '2daa3f15-e69c-4639-91cd-e187ec6a652f',
        justification: 'Payment people',
        date: '1998-02-21',
        value: 150,
      });
    }).rejects.toBeInstanceOf(CreateBillError);
  });

  it('should be able to create a bill', async () => {
    const accountType = await accountTypesRepository.create({
      name: 'test',
    });

    const response = await createBillUseCase.execute({
      accountTypeId: accountType.id,
      justification: 'Payment people',
      date: '1998-02-21',
      value: 150,
    });

    expect(response).toEqual(
      expect.objectContaining({
        accountTypeId: accountType.id,
        justification: 'Payment people',
        date: '1998-02-21',
        value: 150,
      }),
    );
  });
});
