import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';
import * as yup from 'yup';

import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider';

import { UpdateUserAvatarError } from './UpdateUserAvatarError';

interface IRequest {
  userId: string;
  avatarFile: string;
}

@injectable()
class UpdateUserAvatarUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  async execute({ avatarFile, userId }: IRequest): Promise<void> {
    const schema = yup.object().shape({
      user_id: yup.string().uuid().required(),
      avatar_file: yup.string().min(1).required(),
    });
    await schema.validate(
      { user_id: userId, avatar_file: avatarFile },
      { abortEarly: false },
    );

    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new UpdateUserAvatarError();
    }

    if (user.avatar) {
      await this.storageProvider.delete(
        user.avatar,
        process.env.STORAGE_FOLDER,
      );
    }

    await this.storageProvider.save(avatarFile, process.env.STORAGE_FOLDER);

    user.avatar = avatarFile;
    await this.usersRepository.update(user);
  }
}

export { UpdateUserAvatarUseCase };
