interface ICreateUserTokenDTO {
  userId: string;
  token: string;
  expireDate: Date;
}

export { ICreateUserTokenDTO };
