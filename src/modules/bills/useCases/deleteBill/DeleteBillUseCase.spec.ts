import { IBillsRepository } from '@modules/bills/repositories/IBillsRepository';
import { InMemoryBills } from '@modules/bills/repositories/in-memory/InMemoryBills';

import { DeleteBillError } from './DeleteBillError';
import { DeleteBillUseCase } from './DeleteBillUseCase';

let billsRepository: IBillsRepository;
let deleteBillUseCase: DeleteBillUseCase;

describe('DeleteBillUseCase', () => {
  beforeEach(() => {
    billsRepository = new InMemoryBills();
    deleteBillUseCase = new DeleteBillUseCase(billsRepository);
  });

  it('should be able to delete a bill', async () => {
    const bill = await billsRepository.create({
      accountTypeId: '3d687d29-9a0d-4b2b-8012-f151682a661f',
      date: '1998-02-21',
      justification: 'Test',
      value: 150,
    });

    const response = await deleteBillUseCase.execute({
      id: bill.id,
    });
    expect(response).toBeUndefined();
  });

  it('should not be able to delete a bill if bill does not exist', async () => {
    await expect(async () => {
      await deleteBillUseCase.execute({
        id: '3d687d29-9a0d-4b2b-8012-f151682a661f',
      });
    }).rejects.toBeInstanceOf(DeleteBillError);
  });
});
