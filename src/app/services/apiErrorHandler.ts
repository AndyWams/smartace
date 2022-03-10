import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export function handleError(errorResponse: HttpErrorResponse) {
  if (errorResponse.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('Local or network error: ', errorResponse.message);
    return throwError(errorResponse.error);
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
    console.error(
      `Backend returned code ${errorResponse.status} ${JSON.stringify(
        errorResponse.error
      )}`
    );
    throwError(errorResponse.error);
  }
  // return an observable with a user-facing error message
  return throwError(
    `${
      errorResponse.error ? errorResponse.error.message : errorResponse.message
    }`
  );
}
