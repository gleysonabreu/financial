import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateUserUseCase } from './CreateUserUseCase';

class CreateUserController {
  async execute(request: Request, response: Response): Promise<Response> {
    const {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      phone,
      cpf,
      birth_date: birthDate,
      permissions,
    } = request.body;

    const createUser = container.resolve(CreateUserUseCase);
    await createUser.execute({
      email,
      password,
      firstName,
      lastName,
      birthDate,
      cpf,
      phone,
      permissions,
    });

    return response.status(201).send();
  }
}

export { CreateUserController };
