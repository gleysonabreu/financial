interface IGetAllBillDTO {
  take?: number;
  skip?: number;
  justification?: string;
  accountTypeId?: string;
  dateStart?: string;
  dateFinish?: string;
}

export { IGetAllBillDTO };
