import { User } from '@modules/users/entities/User';

interface IAuthenticateUserResponseDTO {
  token: string;
  user: Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>;
  permissions: number[];
}

export { IAuthenticateUserResponseDTO };
