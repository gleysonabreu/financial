import { User } from '@modules/users/entities/User';

interface IAuthenticateUserResponseDTO {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string;
    avatarUrl: string;
  };
  permissions: string[];
}

export { IAuthenticateUserResponseDTO };
