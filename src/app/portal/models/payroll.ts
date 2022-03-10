export interface IEmployee {
  departmentId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  workEmail: string;
  accountNumber: string;
  bankId: string;
  pfa: string;
  taxId: string;
}

export interface IInstitution {
  institutionCatId: string;
  institutionName: string;
  accountName: string;
  accountNumber: string;
  bankId?: string;
}
