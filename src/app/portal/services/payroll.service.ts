import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PayrollService {
  private baseUrl = environment;
  private httpOptions: any;
  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    };
  }

  //Create  Api
  // createProject(model: IPayrol): Observable<any> {
  //   const url = this.baseUrl +
  //   return this.http.post<IPayrol>(url, model, this.httpOptions).pipe(
  //     map((status) => status),
  //     catchError(handleError),
  //   )
  // }

  //Fetch all
  //Fetch Equipment-types Api
  // fetchEquipments(): Observable<any> {
  //   const url = this.baseUrl + `/payroll/institution`
  //   return this.http
  //     .get<any>(url, this.httpOptions)
  //     .pipe(catchError(handleError))
  // }

  //fetch single

  //Fetch single
  // fetchEquipmentLogCheck(equipmentId: number): Observable<any> {
  //   const url = this.baseUrl + `/payroll/institution/${institutionId}`
  //   return this.http
  //     .get<any>(url, this.httpOptions)
  //     .pipe(catchError(handleError))
  // }

  //Update

  // updateInstitution(institutionId: number, model: any): Observable<any>  {
  //   const url = this.baseUrl + `/payroll/institution/${institutionId}`;
  //   return this.http.put(url, model, this.httpOptions).pipe(
  //     map((status) => status),
  //     catchError(handleError),
  //   );
  // }

  //Delete

  // deleteDocument(institutionId: number) {
  //   const url = this.baseUrl + `/payrol/institution/${institutionId}`
  //   return this.http
  //     .delete<any>(url, this.httpOptions)
  //     .pipe(catchError(handleError))
  // }
}
