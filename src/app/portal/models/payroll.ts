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
  pageNumber: string;
  institutionName: string;
  accountName: string;
  accountNumber: string;
  bankId: string;
}
export interface IInstitutionList {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  sortColumn?: string;
  sortOrder?: number;
  filter?: Filter;
}

export interface Filter {
  instituteCategoryId?: any;
  bankId?: any;
  created?: any;
}

export interface IInstitutionCat {
  institutionCatName: string;
}
