import { IAccountTypesRepository } from '@modules/accountTypes/repositories/IAccountTypesRepository';
import { InMemoryAccountTypesRepository } from '@modules/accountTypes/repositories/in-memory/InMemoryAccountTypesRepository';

import { AccountTypeAlreadyExists } from './CreateAccountTypeError';
import { CreateAccountTypeUseCase } from './CreateAccountTypeUseCase';

let accountTypesRepository: IAccountTypesRepository;
let createAccountTypeUseCase: CreateAccountTypeUseCase;

describe('CreateAccountTypeUseCase', () => {
  beforeEach(() => {
    accountTypesRepository = new InMemoryAccountTypesRepository();
    createAccountTypeUseCase = new CreateAccountTypeUseCase(
      accountTypesRepository,
    );
  });

  it('should be able to create a account type', async () => {
    const response = await createAccountTypeUseCase.execute({
      name: 'payment',
    });

    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('name');
  });

  it('should not be able to create a account type if name already exists', async () => {
    await createAccountTypeUseCase.execute({
      name: 'test',
    });

    await expect(async () => {
      await createAccountTypeUseCase.execute({
        name: 'test',
      });
    }).rejects.toBeInstanceOf(AccountTypeAlreadyExists);
  });
});
