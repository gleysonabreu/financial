import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';

import { InMemoryStorageProvider } from '@shared/container/providers/StorageProvider/in-memory/InMemoryStorageProvider';
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider';
import { hash } from '@shared/services/password';

import { UpdateUserAvatarError } from './UpdateUserAvatarError';
import { UpdateUserAvatarUseCase } from './UpdateUserAvatarUseCase';

let updateUserAvatarUseCase: UpdateUserAvatarUseCase;
let usersRepository: IUsersRepository;
let storageProvider: IStorageProvider;

describe('UpdateUserAvatarUseCase.spec', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    storageProvider = new InMemoryStorageProvider();

    updateUserAvatarUseCase = new UpdateUserAvatarUseCase(
      usersRepository,
      storageProvider,
    );
  });

  it('should be able to update avatar', async () => {
    const save = spyOn(storageProvider, 'save');

    const user = await usersRepository.create({
      birthDate: '2020-02-15',
      cpf: '00000000000',
      email: 'test@test.com',
      firstName: 'Testing',
      lastName: 'Test',
      password: await hash('1234567'),
      permission: 'ADMIN',
      phone: '00000000000',
    });

    await updateUserAvatarUseCase.execute({
      avatarFile: 'Testing.png',
      userId: user.id,
    });

    expect(save).toHaveBeenCalled();
  });

  it('should not be able to update avatar if user does not exists', async () => {
    await expect(async () => {
      await updateUserAvatarUseCase.execute({
        avatarFile: 'Testing.png',
        userId: 'd3ad07e3-cd4b-4e52-bbf1-4c9b721c9772',
      });
    }).rejects.toBeInstanceOf(UpdateUserAvatarError);
  });

  it('should be able to update the avatar, but delete the old avatar before', async () => {
    const del = spyOn(storageProvider, 'delete');

    const user = await usersRepository.create({
      birthDate: '2020-02-15',
      cpf: '00000000000',
      email: 'test@test.com',
      firstName: 'Testing',
      lastName: 'Test',
      password: await hash('1234567'),
      permission: 'ADMIN',
      phone: '00000000000',
    });

    await updateUserAvatarUseCase.execute({
      avatarFile: 'Testing.png',
      userId: user.id,
    });

    await updateUserAvatarUseCase.execute({
      avatarFile: 'Testing2.png',
      userId: user.id,
    });

    expect(del).toHaveBeenCalled();
  });
});
