import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { handleError } from 'src/app/services/apiErrorHandler';
import { environment } from 'src/environments/environment';
import { IInstitution, IInstitutionCat, IInstitutionList } from '../models';

@Injectable({
  providedIn: 'root',
})
export class PayrollService {
  private httpOptions: any;
  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${environment.userToken}`,
      }),
    };
  }

  //Fetch AllBanks
  fetchAllBanks(): Observable<any> {
    return this.http
      .get<any>(environment.apiBaseUrl + '/Bank/GetAll', this.httpOptions)
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
  //Fetch Institution
  fetchInstitution() {
    return this.http
      .get<any>(
        environment.apiBaseUrl + `/Institution/GetAll`,
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

  deleteInstitution(institutionId: string) {
    return this.http.delete<any>(
      environment.apiBaseUrl + `/Institution/Delete/${institutionId}`,
      this.httpOptions
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
}
