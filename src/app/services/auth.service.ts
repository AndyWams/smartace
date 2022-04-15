import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IAuth } from '../portal/shared/model';
import { handleError } from './apiErrorHandler';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser: any;
  constructor(private http: HttpClient, public jwtHelper: JwtHelperService) {}
  login(credentials: IAuth): Observable<any> {
    return this.http
      .post<any>(environment.authUrl, credentials)
      .pipe(catchError(handleError));
  }
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token);
  }
  logout() {
    localStorage.removeItem('token');

    return false;
  }
  getUserData() {
    if (!this.currentUser) {
      const token = localStorage.getItem('token');
      if (token) {
        this.currentUser = JSON.parse(
          JSON.stringify(this.jwtHelper.decodeToken(token))
        );
        return this.currentUser;
      }
    }
    return this.currentUser;
  }
}
