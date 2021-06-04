interface ICreateUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  cpf: string;
  birthDate: string;
  phone: string;

  permission: string;
}

export { ICreateUserDTO };
