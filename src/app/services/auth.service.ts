import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IAuth } from '../portal/shared/model';
import { handleError } from './apiErrorHandler';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  login(credentials: IAuth): Observable<any> {
    return this.http
      .post<any>(environment.authUrl, credentials)
      .pipe(catchError(handleError));
  }
}
