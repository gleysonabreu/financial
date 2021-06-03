import { InMemoryPermissionsRepository } from '@modules/permissions/repositories/in-memory/InMemoryPermissionsRepository';
import { IPermissionsRepository } from '@modules/permissions/repositories/IPermissionsRepository';
import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';

import { hash } from '@shared/services/password';

import { CreatePermissionError } from './CreatePermissionError';
import { CreatePermissionsUseCase } from './CreatePermissionsUseCase';

let permissionsRepository: IPermissionsRepository;
let usersRepository: IUsersRepository;
let createPermissionUseCase: CreatePermissionsUseCase;
describe('CreatePermissionUseCase', () => {
  beforeEach(() => {
    permissionsRepository = new InMemoryPermissionsRepository();
    usersRepository = new InMemoryUsersRepository();
    createPermissionUseCase = new CreatePermissionsUseCase(
      usersRepository,
      permissionsRepository,
    );
  });

  it('should be able to create a permission', async () => {
    const user = await usersRepository.create({
      email: 'test@test.com',
      firstName: 'Testing',
      lastName: 'Test',
      birthDate: '1990-02-25',
      cpf: '00000000000',
      phone: '00000000000',
      password: await hash('1234567'),
      permissions: [],
    });

    const response = await createPermissionUseCase.execute({
      type: 1,
      userId: user.id,
    });

    expect(response).toEqual(
      expect.objectContaining({
        userId: user.id,
        type: 1,
      }),
    );
  });

  it('should not be able to create a permission if permission type does not exist', async () => {
    const user = await usersRepository.create({
      email: 'test@test.com',
      firstName: 'Testing',
      lastName: 'Test',
      birthDate: '1990-02-25',
      cpf: '00000000000',
      phone: '00000000000',
      password: await hash('1234567'),
      permissions: [],
    });

    await expect(async () => {
      await createPermissionUseCase.execute({
        type: 4,
        userId: user.id,
      });
    }).rejects.toBeInstanceOf(CreatePermissionError.PermissionNotExist);
  });

  it('should not be able create a permission with user invalid', async () => {
    await expect(async () => {
      await createPermissionUseCase.execute({
        userId: '45eb8c2f-6f67-4325-9a4a-adfd26b723bb',
        type: 1,
      });
    }).rejects.toBeInstanceOf(CreatePermissionError.UserNotFound);
  });

  it('should not be able to create a permission if the permission already exists', async () => {
    await expect(async () => {
      const user = await usersRepository.create({
        email: 'test@test.com',
        firstName: 'Testing',
        lastName: 'Test',
        birthDate: '1990-02-25',
        cpf: '00000000000',
        phone: '00000000000',
        password: await hash('1234567'),
        permissions: [],
      });

      await createPermissionUseCase.execute({
        userId: user.id,
        type: 1,
      });
      await createPermissionUseCase.execute({
        userId: user.id,
        type: 1,
      });
    }).rejects.toBeInstanceOf(
      CreatePermissionError.PermissionAlreadyExistsError,
    );
  });
});
