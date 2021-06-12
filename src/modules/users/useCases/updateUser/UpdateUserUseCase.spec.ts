import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';

import { hash } from '@shared/services/password';

import { UpdateUserUseCase } from './UpdateUserUseCase';
import { UpdateUserUseCaseError } from './UpdateUserUseCaseError';

let updateUserUseCase: UpdateUserUseCase;
let usersRepository: IUsersRepository;

describe('UpdateUserUseCase', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    updateUserUseCase = new UpdateUserUseCase(usersRepository);
  });

  it('should be able to update a user', async () => {
    const user = await usersRepository.create({
      email: 'test@test.com',
      firstName: 'Testing',
      lastName: 'Test again',
      birthDate: '1990-02-25',
      cpf: '00000000000',
      phone: '00000000000',
      password: await hash('1234567'),
      permission: 'ADMIN',
    });

    const response = await updateUserUseCase.execute({
      email: 'testing@test.com',
      firstName: 'Test Account',
      lastName: 'Bakery',
      birthDate: '1990-02-25',
      cpf: '00000000000',
      phone: '00000000000',
      id: user.id,
    });

    expect(response).toEqual(
      expect.objectContaining({
        email: 'testing@test.com',
        firstName: 'Test Account',
        lastName: 'Bakery',
        id: user.id,
      }),
    );
  });

  it('should not be able update a user with wrong id', async () => {
    await expect(async () => {
      await updateUserUseCase.execute({
        email: 'test2@test.com',
        firstName: 'Testing',
        lastName: 'Test again',
        birthDate: '1990-02-25',
        cpf: '00000000002',
        phone: '00000000002',
        id: '1da4d173-2690-4850-b01f-0cd7196f6bc5',
      });
    }).rejects.toBeInstanceOf(UpdateUserUseCaseError.UpdateUserNotFound);
  });

  it('should not be able to update a user with the existing email', async () => {
    await usersRepository.create({
      birthDate: '2020-02-15',
      cpf: '00000000000',
      email: 'test@test.com',
      firstName: 'testing',
      lastName: 'Test again',
      password: await hash('1234567'),
      permission: 'ADMIN',
      phone: '00000000000',
    });
    const user = await usersRepository.create({
      birthDate: '2020-02-15',
      cpf: '00000000003',
      email: 'testemail@test.com',
      firstName: 'testing',
      lastName: 'Test',
      password: await hash('1234567'),
      permission: 'ADMIN',
      phone: '00000000003',
    });
    await expect(async () => {
      await updateUserUseCase.execute({
        birthDate: '2020-02-15',
        cpf: '00000000003',
        email: 'test@test.com',
        firstName: 'testing',
        lastName: 'Test again',
        phone: '00000000003',
        id: user.id,
      });
    }).rejects.toBeInstanceOf(UpdateUserUseCaseError.EmailAlreadyExistsError);
  });

  it('should not be able to update a user with cpf already exists', async () => {
    await usersRepository.create({
      email: 'test6@test.com',
      firstName: 'Testing',
      lastName: 'Test again',
      birthDate: '1990-02-25',
      cpf: '00000000006',
      phone: '00000000006',
      password: await hash('1234567'),
      permission: 'ADMIN',
    });
    const user = await usersRepository.create({
      email: 'test7@test.com',
      firstName: 'Testing',
      lastName: 'Test',
      birthDate: '1990-02-25',
      cpf: '00000000007',
      phone: '00000000007',
      password: await hash('1234567'),
      permission: 'ADMIN',
    });
    await expect(async () => {
      await updateUserUseCase.execute({
        email: 'test7@test.com',
        firstName: 'Testing',
        lastName: 'Test again',
        birthDate: '1990-02-25',
        cpf: '00000000006',
        phone: '00000000007',
        id: user.id,
      });
    }).rejects.toBeInstanceOf(UpdateUserUseCaseError.CpfAlreadyExists);
  });

  it('should not be able to update a user with phone already exists', async () => {
    await usersRepository.create({
      email: 'test4@test.com',
      firstName: 'Testing',
      lastName: 'Test again',
      birthDate: '1990-02-25',
      cpf: '00000000004',
      phone: '00000000004',
      password: await hash('1234567'),
      permission: 'ADMIN',
    });

    const user = await usersRepository.create({
      email: 'test5@test.com',
      firstName: 'Testing',
      lastName: 'Test again',
      birthDate: '1990-02-25',
      cpf: '00000000005',
      phone: '00000000005',
      password: await hash('1234567'),
      permission: 'ADMIN',
    });
    await expect(async () => {
      await updateUserUseCase.execute({
        email: 'test5@test.com',
        firstName: 'Testing',
        lastName: 'Test again',
        birthDate: '1990-02-25',
        cpf: '00000000005',
        phone: '00000000004',
        id: user.id,
      });
    }).rejects.toBeInstanceOf(UpdateUserUseCaseError.PhoneAlreadyExists);
  });
});
