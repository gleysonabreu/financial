import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';

import { hash } from '@shared/services/password';

import { GetAllUserUseCase } from './GetAllUserUseCase';

let usersRepository: IUsersRepository;
let getAllUserUseCase: GetAllUserUseCase;

describe('GetAllUserUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    getAllUserUseCase = new GetAllUserUseCase(usersRepository);
  });

  it('should be able to get all users', async () => {
    const user = await usersRepository.create({
      firstName: 'Testing',
      lastName: 'Test',
      email: 'test@test.com',
      password: await hash('1234567'),
      birthDate: '1990-02-25',
      cpf: '00000000000',
      phone: '00000000000',
      permissions: [
        {
          type: 1,
        },
      ],
    });

    const { users } = await getAllUserUseCase.execute({});
    expect(users).toEqual([user]);
  });

  it('should be able to get all users by first name', async () => {
    const user = await usersRepository.create({
      firstName: 'Testing',
      lastName: 'Google',
      email: 'test@test.com',
      password: await hash('1234567'),
      birthDate: '1990-02-25',
      cpf: '00000000000',
      phone: '00000000000',
      permissions: [
        {
          type: 1,
        },
      ],
    });

    const { users } = await getAllUserUseCase.execute({
      name: 'ting',
    });
    expect(users).toEqual([user]);
  });

  it('should be able to get all users by last name', async () => {
    const user = await usersRepository.create({
      firstName: 'Testing',
      lastName: 'Google',
      email: 'test@test.com',
      password: await hash('1234567'),
      birthDate: '1990-02-25',
      cpf: '00000000000',
      phone: '00000000000',
      permissions: [
        {
          type: 1,
        },
      ],
    });

    const { users } = await getAllUserUseCase.execute({
      name: 'goo',
    });
    expect(users).toEqual([user]);
  });

  it('should be able to get all users by cpf', async () => {
    const user = await usersRepository.create({
      firstName: 'Testing',
      lastName: 'Google',
      email: 'test@test.com',
      password: await hash('1234567'),
      birthDate: '1990-02-25',
      cpf: '00000000001',
      phone: '00000000000',
      permissions: [
        {
          type: 1,
        },
      ],
    });

    const { users } = await getAllUserUseCase.execute({
      cpf: '00',
    });
    expect(users).toEqual([user]);
  });

  it('should be able to get all users by cpf and first/last name', async () => {
    const user = await usersRepository.create({
      firstName: 'Google',
      lastName: 'Google',
      email: 'test@test.com',
      password: await hash('1234567'),
      birthDate: '1990-02-25',
      cpf: '00000000001',
      phone: '00000000000',
      permissions: [
        {
          type: 1,
        },
      ],
    });

    const user2 = await usersRepository.create({
      firstName: 'Maria',
      lastName: 'Maria',
      email: 'test_maria@test.com',
      password: await hash('1234567'),
      birthDate: '1990-02-25',
      cpf: '11111111111',
      phone: '11111111111',
      permissions: [
        {
          type: 1,
        },
      ],
    });

    const { users } = await getAllUserUseCase.execute({
      name: 'goo',
      cpf: '111',
    });
    expect(users).toEqual([user, user2]);
  });
});
