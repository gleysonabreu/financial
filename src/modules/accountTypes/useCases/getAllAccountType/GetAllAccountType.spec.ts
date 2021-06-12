import { IAccountTypesRepository } from '@modules/accountTypes/repositories/IAccountTypesRepository';
import { InMemoryAccountTypesRepository } from '@modules/accountTypes/repositories/in-memory/InMemoryAccountTypesRepository';

import { GetAllAccountType } from './GetAllAccountType';

let accountTypesRepository: IAccountTypesRepository;
let getAllAccountType: GetAllAccountType;

describe('GetAllAccountType', () => {
  beforeEach(() => {
    accountTypesRepository = new InMemoryAccountTypesRepository();

    getAllAccountType = new GetAllAccountType(accountTypesRepository);
  });

  it('should be able to get all account type', async () => {
    const accountType = await accountTypesRepository.create({
      name: 'test',
    });

    const { accountTypes } = await getAllAccountType.execute({});
    expect(accountTypes).toEqual([accountType]);
  });

  it('should be able to get all account types by name', async () => {
    const accountType = await accountTypesRepository.create({
      name: 'test',
    });

    const { accountTypes } = await getAllAccountType.execute({
      name: 't',
    });
    expect(accountTypes).toEqual([accountType]);
  });

  it('should not be able to get all account types by name if name does not exist', async () => {
    const accountType = await accountTypesRepository.create({
      name: 'criatura',
    });

    const { accountTypes } = await getAllAccountType.execute({
      name: 'g',
    });
    expect(accountTypes).not.toEqual([accountType]);
  });
});
