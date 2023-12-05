import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { BehaviorSubject, Observable, ReplaySubject, throwError } from 'rxjs';

import { PopUpService } from './popup.service';
import { FetchingService } from './fetching.service';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  public errorSubject = new BehaviorSubject<string | null>(null);
  public error$: Observable<string | null> = this.errorSubject.asObservable();
  constructor(private fetchingService: FetchingService) {}

  public clearErrorService(): void {
    this.errorSubject.next(null);
  }

  handleError(error: any): void {
    let errorMessage = 'An unknown error occurred';
    if (error instanceof HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        errorMessage = `HTTP Error: ${error.error.message}`;
      } else if (typeof error.error === 'string') {
        errorMessage = `HTTP Error: ${error.error}`;
      }
    } else if (error instanceof TypeError) {
      errorMessage = `Client-Side Error: ${error.message}`;
    } else if (error instanceof Error) {
      errorMessage = `Error: ${error.message}`;
    } else if (error.name === 'TimeoutError') {
      errorMessage = `Timeout Error: ${error.message}`;
    } else {
      errorMessage = `Unknown Error: ${error}`;
    }
    this.fetchingService.isFetchingSubject.next(false);
    this.errorSubject.next(errorMessage);
    console.error(errorMessage);
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
