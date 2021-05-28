import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';
import * as yup from 'yup';

import { RemoveUserError } from './RemoveUserError';

interface IRequest {
  userId: string;
}

@injectable()
class RemoveUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ userId }: IRequest): Promise<void> {
    const schema = yup.object().shape({
      user_id: yup.string().uuid().required(),
    });
    await schema.validate({ user_id: userId }, { abortEarly: false });

    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new RemoveUserError();
    }

    await this.usersRepository.remove(user);
  }
}

export { RemoveUserUseCase };
