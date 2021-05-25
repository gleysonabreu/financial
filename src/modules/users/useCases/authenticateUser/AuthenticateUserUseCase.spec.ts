import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';

import { hash } from '@shared/services/password';

import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';
import { IncorrectEmailOrPassword } from './IncorrectEmailOrPassword';

let authenticateUserCase: AuthenticateUserUseCase;
let usersRepository: IUsersRepository;

describe('AuthenticateUserUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUserCase = new AuthenticateUserUseCase(usersRepository);
  });

  it('should be able to authenticate', async () => {
    await usersRepository.create({
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

    const response = await authenticateUserCase.execute({
      email: 'test@test.com',
      password: '1234567',
    });

    expect(response).toHaveProperty('token');
    expect(response).toHaveProperty('user');
  });

  it('should not be able to authenticate with wrong password', async () => {
    await expect(async () => {
      await usersRepository.create({
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

      await authenticateUserCase.execute({
        email: 'test@test.com',
        password: '123456',
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPassword);
  });

  it('should not be able to authenticate with wrong email', async () => {
    await expect(async () => {
      await usersRepository.create({
        firstName: 'Testing',
        lastName: 'Test',
        email: 'test@test.com',
        birthDate: '1990-02-25',
        cpf: '00000000000',
        phone: '00000000000',
        password: await hash('1234567'),
        permissions: [
          {
            type: 1,
          },
        ],
      });

      await authenticateUserCase.execute({
        email: 'test@test.co',
        password: '1234567',
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPassword);
  });
});
