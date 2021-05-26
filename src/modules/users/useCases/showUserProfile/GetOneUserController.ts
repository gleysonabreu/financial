import { ProfileData } from '@modules/users/mappers/ProfileData';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';

class GetOneUserController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const showUserProfile = container.resolve(ShowUserProfileUseCase);
    const user = await showUserProfile.execute(id);

    const profileView = ProfileData.toDTO(user);
    return response.json(profileView);
  }
}

export { GetOneUserController };
