import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

class AuthenticateUserController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUser = container.resolve(AuthenticateUserUseCase);
    const { token, user, permissions } = await authenticateUser.execute({
      email,
      password,
    });

    return response.json({ user, token, permissions });
  }
}

export { AuthenticateUserController };
