import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private errorSubject = new Subject<string>();

  getErrorStream() {
    return this.errorSubject.asObservable();
  }

  handleError(error: HttpErrorResponse) {
    // console.error(error);
  }
}



// private handleError(errorRes: HttpErrorResponse) {
//   let errorMessage = 'An unknown error occurred!';

//   if (errorRes.error && errorRes.error.error) {
//     switch (errorRes.error.error.message) {
//       case 'EMAIL_EXISTS':
//         errorMessage = 'This email already exists.';
//         break;
//       case 'EMAIL_NOT_FOUND':
//         errorMessage = 'This email does not exist.';
//         break;
//       case 'INVALID_PASSWORD':
//         errorMessage = 'This password is not correct.';
//         break;
//     }
//   } else if (errorRes.error && errorRes.error.message) {
//     errorMessage = errorRes.error.message;
//   }

//   const formattedErrorMessage = `${errorRes.status}: ${errorMessage}`;
//   return throwError(formattedErrorMessage);
// }