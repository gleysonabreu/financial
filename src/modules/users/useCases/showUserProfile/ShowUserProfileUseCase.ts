import { IUser } from '@modules/users/DTO/IUser';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';
import * as yup from 'yup';

import { ShowUserProfileError } from './ShowUserProfileError';

@injectable()
class ShowUserProfileUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute(id: string): Promise<IUser> {
    const schema = yup.object().shape({
      id: yup.string().uuid().required(),
    });
    await schema.validate({ id }, { abortEarly: false });

    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new ShowUserProfileError();
    }

    return user;
  }
}

export { ShowUserProfileUseCase };
