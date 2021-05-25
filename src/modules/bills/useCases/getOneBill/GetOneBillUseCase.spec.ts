import { IAccountTypesRepository } from '@modules/accountTypes/repositories/IAccountTypesRepository';
import { InMemoryAccountTypesRepository } from '@modules/accountTypes/repositories/in-memory/InMemoryAccountTypesRepository';
import { IBillsRepository } from '@modules/bills/repositories/IBillsRepository';
import { InMemoryBills } from '@modules/bills/repositories/in-memory/InMemoryBills';

import { GetOneBillError } from './GetOneBillError';
import { GetOneBillUseCase } from './GetOneBillUseCase';

let accountTypesRepository: IAccountTypesRepository;
let billsRepository: IBillsRepository;
let getOneBillUseCase: GetOneBillUseCase;

describe('GetOneBillUseCase', () => {
  beforeEach(() => {
    accountTypesRepository = new InMemoryAccountTypesRepository();
    billsRepository = new InMemoryBills();
    getOneBillUseCase = new GetOneBillUseCase(billsRepository);
  });

  it('should be able to get one bill', async () => {
    const accountType = await accountTypesRepository.create({
      name: 'test',
    });
    const bill = await billsRepository.create({
      accountTypeId: accountType.id,
      justification: 'Test',
      value: 15,
    });

    const response = await getOneBillUseCase.execute({
      id: bill.id,
    });
    expect(response).toHaveProperty('id');
  });

  it('should not be able to get one bill if bill not exist', async () => {
    await expect(async () => {
      await getOneBillUseCase.execute({
        id: '3d687d29-9a0d-4b2b-8012-f151682a661f',
      });
    }).rejects.toBeInstanceOf(GetOneBillError);
  });
});
