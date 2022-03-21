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
export interface IDepartment {
  departmentName: string;
}

export interface IEmployeeList {
  pageNumber: number;
  pageSize: number;
  search: string;
  sortColumn: string;
  sortOrder: number;
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
  filter?: IInstitutionFilter;
}

export interface IInstitutionFilter {
  instituteCategoryId?: any;
  bankId?: any;
  created?: any;
}

export interface IInstitutionCat {
  institutionCatName: string;
}

export interface IPayElement {
  institutionId: string;
  payElementName: string;
  elementType: number;
  payType: number;
  payElementCategoryId: string;
  paymentMode: number;
  payElementAmount: number;
  payElementPercentage: number;
  deductTax: boolean;
  taxId: string;
  taxValue: number;
  payElementLine: IPayElementLine[];
}
export interface IPayElementList {
  pageNumber: number;
  pageSize: number;
  search: string;
  sortColumn: string;
  sortOrder: number;
  filter: IPayElementFilter;
}

export interface IPayElementFilter {
  payElementCatId: string;
  payType: number;
  elementType: number;
  payElementName: string;
  payElementAmount: number;
  institutionId: string;
}

export interface IPayElementLine {
  payElementId: string;
}
export interface IPayElementCat {
  payElementCatName: string;
}
export interface IPayElementCatList {
  pageNumber: number;
  pageSize: number;
  search: string;
  sortColumn: string;
  sortOrder: number;
}

export interface IPayscaleFilter {
  payScaleName: string;
  frequency: number;
}

export interface IPayscaleList {
  pageNumber: number;
  pageSize: number;
  search: string;
  sortColumn: string;
  sortOrder: number;
  filter: IPayscaleFilter;
}

export interface IPayscale {
  payScaleName: string;
  frequency: number;
  payScaleElements: IPayScaleElement[];
  payScaleEmployees: PayScaleEmployee[];
}

export interface IPayScaleElement {
  payElementId: string;
}

export interface PayScaleEmployee {
  employeeId: string;
}

export interface ITaxType {
  taxName: string;
  taxPercentage: number;
  taxId: string;
}
export interface ITaxTypeList {
  pageNumber: number;
  pageSize: number;
  search: string;
  sortColumn: string;
  sortOrder: number;
}

export interface ITaxSettings {
  isTaxEnable: boolean;
  taxId: string;
  countryId: string;
  stateId: string;
}

export interface IPaySchedule {
  payScheduleName: string;
  frequency: string;
  date: string;
  deadline: string;
  payPeriod: boolean;
}
