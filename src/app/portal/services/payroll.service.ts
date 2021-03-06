import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { handleError } from 'src/app/services/apiErrorHandler';
import { environment } from 'src/environments/environment';
import {
  IDepartment,
  IEmployee,
  IEmployeeList,
  IInstitution,
  IInstitutionCat,
  IInstitutionList,
  IPayElement,
  IPayElementCat,
  IPayElementExta,
  IPayElementList,
  IPayscale,
  IPayscaleList,
  IPaySchedule,
  ITaxSettings,
  ITaxType,
  ITaxTypeList,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class PayrollService {
  private httpOptions: any;
  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    };
  }
  //approve Payroll
  approvePayroll(id: any): Observable<any> {
    return this.http
      .get<any>(
        environment.apiBaseUrl + `/Payroll/AprrovePayroll/${id}`,
        this.httpOptions
      )
      .pipe(catchError(handleError));
  }
  //assign Employees to Payscale
  assignEmployeesToPayScale(model: any): Observable<any> {
    return this.http
      .put<any>(
        environment.apiBaseUrl + '/PayScale/AssignEmployeesToScale',
        model,
        this.httpOptions
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  //BankSchedule Details
  BankScheduleDetails(model: any) {
    return this.http
      .post<any>(
        environment.apiBaseUrl + '/Report/BankScheduleDetails',
        model,
        this.httpOptions
      )
      .pipe(catchError(handleError));
  }
  //compute payroll
  computePayroll(model: any): Observable<any> {
    return this.http
      .post<any>(
        environment.apiBaseUrl + '/Payroll/ComputePayroll',
        model,
        this.httpOptions
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  //check employees not in payscale
  checkEmployeesNotInPayScale() {
    return this.http
      .get<any>(
        environment.apiBaseUrl + '/Payroll/CheckEmployeeNotInPayScale',
        this.httpOptions
      )
      .pipe(catchError(handleError));
  }
  //check employees not in payscale
  runCheckEmployeesNotInPayScale(model: any) {
    return this.http
      .post<any>(
        environment.apiBaseUrl + '/Payroll/CheckEmployeeNotInPayScale',
        this.httpOptions
      )
      .pipe(catchError(handleError));
  }
  //Create Department
  createDepartment(model: IDepartment): Observable<any> {
    return this.http
      .post<IDepartment>(
        environment.apiBaseUrl + '/Department/Create',
        model,
        this.httpOptions
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }

  //Create Employee
  createEmployee(model: IEmployee): Observable<any> {
    return this.http
      .post<IEmployee>(
        environment.apiBaseUrl + '/Employee/Create',
        model,
        this.httpOptions
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }

  //Create Institution
  createInstitution(model: IInstitution): Observable<any> {
    return this.http
      .post<IInstitution>(
        environment.apiBaseUrl + '/Institution/Create',
        model,
        this.httpOptions
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }

  //Create Institution Category
  createInstitutionCat(model: IInstitutionCat): Observable<any> {
    return this.http
      .post<IInstitutionCat>(
        environment.apiBaseUrl + '/InstitutionCategory/Create',
        model,
        this.httpOptions
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  //Create Pay Element
  createPayElement(model: IPayElement): Observable<any> {
    return this.http
      .post<IPayElement>(
        environment.apiBaseUrl + '/PayElement/Create',
        model,
        this.httpOptions
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  //Create Pay Element Extra
  addPayElementExtra(model: IPayElementExta): Observable<any> {
    return this.http
      .post<IPayElement>(
        environment.apiBaseUrl + '/PayrollExtra/Create',
        model,
        this.httpOptions
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  //Create Pay Element Category
  createPayElementCategory(model: IPayElementCat): Observable<any> {
    return this.http
      .post<IPayElementCat>(
        environment.apiBaseUrl + '/PayElementCategory/Create',
        model,
        this.httpOptions
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }

  //Create Tax
  createTax(model: any): Observable<any> {
    return this.http
      .post<any>(
        environment.apiBaseUrl + '/Tax/Create',
        model,
        this.httpOptions
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  //Create Quick Payroll
  createQuickParoll(model: any): Observable<any> {
    return this.http
      .post<any>(
        environment.apiBaseUrl + '/Payroll/QuickPayroll',
        model,
        this.httpOptions
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  //Create ParollItem
  createParollItem(model: any): Observable<any> {
    return this.http
      .post<any>(
        environment.apiBaseUrl + '/PayrollItem/Create',
        model,
        this.httpOptions
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  //Create Payscale
  createPayscale(model: IPayscale): Observable<any> {
    return this.http
      .post<IPayscale>(
        environment.apiBaseUrl + '/PayScale/Create',
        model,
        this.httpOptions
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  //Create Payschedule
  createPaySchedule(model: IPaySchedule): Observable<any> {
    return this.http
      .post<IPaySchedule>(
        environment.apiBaseUrl + '/PaySchedule/Create',
        model,
        this.httpOptions
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  //approve Payroll
  declinePayrollApproval(id: any): Observable<any> {
    return this.http
      .get<any>(
        environment.apiBaseUrl + `/Payroll/RejectPayroll/${id}`,
        this.httpOptions
      )
      .pipe(catchError(handleError));
  }

  deleteInstitution(institutionId: string) {
    return this.http.delete<any>(
      environment.apiBaseUrl + `/Institution/Delete/${institutionId}`,
      this.httpOptions
    );
  }
  deletePayElement(id: string) {
    return this.http.delete<any>(
      environment.apiBaseUrl + `/PayElement/Delete/${id}`,
      this.httpOptions
    );
  }
  deletePayScale(id: string) {
    return this.http.delete<any>(
      environment.apiBaseUrl + `/PayScale/Delete/${id}`,
      this.httpOptions
    );
  }
  deletePaySchedule(id: string) {
    return this.http.delete<any>(
      environment.apiBaseUrl + `/PaySchedule/Delete/${id}`,
      this.httpOptions
    );
  }
  deleteTaxType(taxId: string) {
    return this.http.delete<any>(
      environment.apiBaseUrl + `/Tax/Delete/${taxId}`,
      this.httpOptions
    );
  }
  deletePayroll(payrollId: string) {
    return this.http.delete<any>(
      environment.apiBaseUrl + `/Payroll/DeletePayroll/${payrollId}`,
      this.httpOptions
    );
  }
  //Fetch Country
  fetchCountries(): Observable<any> {
    return this.http
      .get<any>(environment.apiBaseUrl + '/Country/GetAll', this.httpOptions)
      .pipe(catchError(handleError));
  }
  //Fetch State
  fetchStates(): Observable<any> {
    return this.http
      .get<any>(environment.apiBaseUrl + '/State/GetAll', this.httpOptions)
      .pipe(catchError(handleError));
  }
  //Fetch AllBanks
  fetchAllBanks(): Observable<any> {
    return this.http
      .get<any>(environment.apiBaseUrl + '/Bank/GetAll', this.httpOptions)
      .pipe(catchError(handleError));
  }
  //Fetch Department
  fetchDepartment(): Observable<any> {
    return this.http
      .get<any>(environment.apiBaseUrl + '/Department/GetAll', this.httpOptions)
      .pipe(catchError(handleError));
  }
  // fetch Employee details by Payscale Id
  fetchEmployeeDetailsByPayscaleId(id: any): Observable<any> {
    return this.http
      .get<any>(
        environment.apiBaseUrl +
          `/PayScale/ReturnEmployeePayDetailsByEmployeeId/${id}`,
        this.httpOptions
      )
      .pipe(catchError(handleError));
  }

  //Fetch All Employees
  fetchAllEmployees(model: IEmployeeList) {
    return this.http
      .post<IEmployeeList>(
        environment.apiBaseUrl + '/Employee/List',
        model,
        this.httpOptions
      )
      .pipe(catchError(handleError));
  }
  //Fetch Institution
  fetchInstitution() {
    return this.http
      .get<any>(
        environment.apiBaseUrl + `/Institution/GetAll`,
        this.httpOptions
      )
      .pipe(catchError(handleError));
  }
  //Fetch All Institution
  fetchAllInstitution(model: IInstitutionList) {
    return this.http
      .post<IInstitutionList>(
        environment.apiBaseUrl + '/Institution/List',
        model,
        this.httpOptions
      )
      .pipe(catchError(handleError));
  }
  //Fetch Pay Element
  fetchPayElement() {
    return this.http
      .get<any>(environment.apiBaseUrl + '/PayElement/GetAll', this.httpOptions)
      .pipe(catchError(handleError));
  }
  //Fetch  Pay Element Details
  fetchPayElementDetails(id: any): Observable<any> {
    return this.http
      .get<any>(
        environment.apiBaseUrl + `/PayElement/Details/${id}`,
        this.httpOptions
      )
      .pipe(catchError(handleError));
  }
  // fetchPayrollLogDetails
  fetchPayrollLogDetails(id: any): Observable<any> {
    return this.http
      .get<any>(
        environment.apiBaseUrl + `/Payroll/PayrollLogDetails/${id}`,
        this.httpOptions
      )
      .pipe(catchError(handleError));
  }
  //Fetch  Enums
  fetchEnums(): Observable<any> {
    return this.http
      .get<any>(environment.apiBaseUrl + `/Lookup/Enums`, this.httpOptions)
      .pipe(catchError(handleError));
  }
  //Fetch All Pay Elements List
  fetchAllPayElements(model: IPayElementList) {
    return this.http
      .post<IPayElementList>(
        environment.apiBaseUrl + '/PayElement/List',
        model,
        this.httpOptions
      )
      .pipe(catchError(handleError));
  }
  //Fetch Pay Element Category
  fetchPayElementCategory() {
    return this.http
      .get<any>(
        environment.apiBaseUrl + '/PayElementCategory/GetAll',
        this.httpOptions
      )
      .pipe(catchError(handleError));
  }
  //Fetch PayScale
  fetchPayScales(): Observable<any> {
    return this.http
      .get<any>(environment.apiBaseUrl + '/PayScale/GetAll', this.httpOptions)
      .pipe(catchError(handleError));
  }
  //Fetch All Payscale
  fetchAllPayscale(model: IPayscaleList) {
    return this.http
      .post<IPayscaleList>(
        environment.apiBaseUrl + '/PayScale/List',
        model,
        this.httpOptions
      )
      .pipe(catchError(handleError));
  }
  //Fetch All Payscale Employees
  fetchAllPayscaleEmployees(model: any) {
    return this.http
      .post<any>(
        environment.apiBaseUrl + '/PayScale/EmployeeList',
        model,
        this.httpOptions
      )
      .pipe(catchError(handleError));
  }
  //Fetch  Payscale Details
  fetchPayScaleDetails(id: any): Observable<any> {
    return this.http
      .get<any>(
        environment.apiBaseUrl + `/PayScale/Details/${id}`,
        this.httpOptions
      )
      .pipe(catchError(handleError));
  }
  //Fetch  PaySchedule Details
  fetchPayScheduleDetails(id: any): Observable<any> {
    return this.http
      .get<any>(
        environment.apiBaseUrl + `/PaySchedule/Details/${id}`,
        this.httpOptions
      )
      .pipe(catchError(handleError));
  }
  //Fetch All PaySchedule List
  fetchAllPaySchedule(model: any) {
    return this.http
      .post<any>(
        environment.apiBaseUrl + '/PaySchedule/List',
        model,
        this.httpOptions
      )
      .pipe(catchError(handleError));
  }
  //Fetch PaySchedules
  fetchPaySchedules(): Observable<any> {
    return this.http
      .get<any>(
        environment.apiBaseUrl + '/PaySchedule/GetAll',
        this.httpOptions
      )
      .pipe(catchError(handleError));
  }
  //Fetch Payrollrunlog
  fetchPayrollRunLog(model: any) {
    return this.http
      .post<any>(
        environment.apiBaseUrl + `/Payroll/Payrolllog`,
        model,
        this.httpOptions
      )
      .pipe(catchError(handleError));
  }
  //Fetch Institution Category
  fetchInstitutionCategory(): Observable<any> {
    return this.http
      .get<any>(
        environment.apiBaseUrl + '/InstitutionCategory/GetAll',
        this.httpOptions
      )
      .pipe(catchError(handleError));
  }

  //Fetch  Institution Details
  fetchInstitutionDetails(id: any): Observable<any> {
    return this.http
      .get<any>(
        environment.apiBaseUrl + `/Institution/Details/${id}`,
        this.httpOptions
      )
      .pipe(catchError(handleError));
  }
  //Fetch  Tax type Details
  fetchTaxTypeDetails(id: any): Observable<any> {
    return this.http
      .get<any>(environment.apiBaseUrl + `/Tax/Details/${id}`, this.httpOptions)
      .pipe(catchError(handleError));
  }

  //Fetch Tax Types
  fetchTaxTypes(): Observable<any> {
    return this.http
      .get<any>(environment.apiBaseUrl + '/Tax/GetAll', this.httpOptions)
      .pipe(catchError(handleError));
  }
  //Fetch All Tax Type
  fetchAllTaxTypes(model: ITaxTypeList) {
    return this.http
      .post<ITaxTypeList>(
        environment.apiBaseUrl + '/Tax/List',
        model,
        this.httpOptions
      )
      .pipe(catchError(handleError));
  }

  //Fetch Tax Types
  fetchSettingsDetails(): Observable<any> {
    return this.http
      .get<any>(
        environment.apiBaseUrl + '/PayrollSettings/Details',
        this.httpOptions
      )
      .pipe(catchError(handleError));
  }

  //Fetch Payroll Items
  fetchPayrollItems(): Observable<any> {
    return this.http
      .get<any>(
        environment.apiBaseUrl + '/PayrollItem/GetAll',
        this.httpOptions
      )
      .pipe(catchError(handleError));
  }
  //Get Employee Payslip
  getEmployeePaySlip(model: any) {
    return this.http
      .post<any>(
        environment.apiBaseUrl + '/Payroll/GetEmployeePayslip',
        model,
        this.httpOptions
      )
      .pipe(catchError(handleError));
  }
  //BankSchedule List Report
  generateBankScheduleListReport(model: any) {
    return this.http
      .post<any>(
        environment.apiBaseUrl + '/Report/BankScheduleList',
        model,
        this.httpOptions
      )
      .pipe(catchError(handleError));
  }

  //Get Gross/Net
  getGrossNet(model: any) {
    return this.http
      .post<any>(
        environment.apiBaseUrl + '/Payroll/GetGrossNet',
        model,
        this.httpOptions
      )
      .pipe(catchError(handleError));
  }
  //Get gross net breakdown
  getGrossNetBreakdown(model: any): Observable<any> {
    return this.http
      .post<any>(
        environment.apiBaseUrl + `/Payroll/GrossNetBreakdown`,
        model,
        this.httpOptions
      )
      .pipe(catchError(handleError));
  }
  //Get Tenant Bank Balance
  getTenanceBankBalance() {
    return this.http
      .get<any>(
        environment.apiBaseUrl + '/Payroll/GetTenantBankBalance',
        this.httpOptions
      )
      .pipe(catchError(handleError));
  }
  //Payroll log Analysis
  payrollLogPayslipAnalysis(model: any) {
    return this.http
      .post<any>(
        environment.apiBaseUrl + '/Payroll/PayrollLogPayslipAnalysis',
        model,
        this.httpOptions
      )
      .pipe(catchError(handleError));
  }
  //Fetch Employees By PayscaleId
  returnEmployeesNetByPayScaleId(model: any): Observable<any> {
    return this.http
      .post<any>(
        environment.apiBaseUrl + '/PayScale/ReturnEmployeesNetPayByPayScaleId',
        model,
        this.httpOptions
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  //Return Employee Net Pay
  returnEmployeeNetPay(model: any) {
    return this.http
      .post<any>(
        environment.apiBaseUrl + '/PayScale/ReturnEmployeesNetPay',
        model,
        this.httpOptions
      )
      .pipe(catchError(handleError));
  }
  //Report BankSchedule list
  reportBankScheduleList(model: any) {
    return this.http
      .post<any>(
        environment.apiBaseUrl + '/Report/BankScheduleList',
        model,
        this.httpOptions
      )
      .pipe(catchError(handleError));
  }
  //Report BankSchedule Details
  reportBankScheduleDetails(model: any) {
    return this.http
      .post<any>(
        environment.apiBaseUrl + '/Report/BankScheduleDetails',
        model,
        this.httpOptions
      )
      .pipe(catchError(handleError));
  }

  //Save Tax
  saveTax(model: ITaxSettings): Observable<any> {
    return this.http
      .post<ITaxSettings>(
        environment.apiBaseUrl + '/PayrollSettings/SaveTax',
        model,
        this.httpOptions
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  //Save Tax
  saveNHF(model: any): Observable<any> {
    return this.http
      .post<any>(
        environment.apiBaseUrl + '/PayrollSettings/SaveNHF',
        model,
        this.httpOptions
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  //Save Pension
  savePension(model: any): Observable<any> {
    return this.http
      .post<any>(
        environment.apiBaseUrl + '/PayrollSettings/SavePension',
        model,
        this.httpOptions
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  //Update Institution
  updateInstitution(model: IInstitution): Observable<any> {
    return this.http
      .put<IInstitution>(
        environment.apiBaseUrl + '/Institution/Edit',
        model,
        this.httpOptions
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  updatePayElement(model: IPayElement): Observable<any> {
    return this.http
      .put<IPayElement>(
        environment.apiBaseUrl + '/PayElement/Edit',
        model,
        this.httpOptions
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  updatePaySchedule(model: any): Observable<any> {
    return this.http
      .put<any>(
        environment.apiBaseUrl + '/PaySchedule/Edit',
        model,
        this.httpOptions
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  updatePayelementExtra(model: any): Observable<any> {
    return this.http
      .put<any>(
        environment.apiBaseUrl + '/PayrollExtra/Edit',
        model,
        this.httpOptions
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  updatePayscale(model: IPayscale): Observable<any> {
    return this.http
      .put<IPayscale>(
        environment.apiBaseUrl + '/PayScale/Edit',
        model,
        this.httpOptions
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
  updateTaxType(model: ITaxType): Observable<any> {
    return this.http
      .put<ITaxType>(
        environment.apiBaseUrl + '/Tax/Edit',
        model,
        this.httpOptions
      )
      .pipe(
        map((status) => status),
        catchError(handleError)
      );
  }
}
