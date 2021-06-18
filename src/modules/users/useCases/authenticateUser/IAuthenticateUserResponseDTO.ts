interface IAuthenticateUserResponseDTO {
  token: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
    avatar_url: string;
  };
  permissions: string[];
}

export { IAuthenticateUserResponseDTO };
