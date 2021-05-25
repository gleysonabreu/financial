interface ICreateUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  cpf: string;
  birthDate: string;
  phone: string;

  permissions: {
    type: number;
  }[];
}

export { ICreateUserDTO };
