import { ProfileData } from '@modules/users/mappers/ProfileData';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateUserUseCase } from './UpdateUserUseCase';

class UpdateUserController {
  async execute(request: Request, response: Response): Promise<Response> {
    const {
      first_name: firstName,
      last_name: lastName,
      email,
      cpf,
      phone,
      birth_date: birthDate,
    } = request.body;
    const { id } = request.user;

    const updateUserUseCase = container.resolve(UpdateUserUseCase);
    const user = await updateUserUseCase.execute({
      email,
      firstName,
      id,
      lastName,
      cpf,
      phone,
      birthDate,
    });

    const profileData = ProfileData.toDTO(user);
    return response.json(profileData);
  }
}

export { UpdateUserController };
