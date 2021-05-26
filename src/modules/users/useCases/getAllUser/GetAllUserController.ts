import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { GetAllUserUseCase } from './GetAllUserUseCase';

class GetAllUserController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { cpf, name, per_page: perPage, page = 1 } = request.query;

    const getAllUserUseCase = container.resolve(GetAllUserUseCase);
    const { users, totalUsers } = await getAllUserUseCase.execute({
      cpf: cpf as string,
      name: name as string,
      skip: Number(page),
      take: Number(perPage),
    });

    response.header('X-Total-Count', `${totalUsers}`);
    return response.json(users);
  }
}

export { GetAllUserController };
