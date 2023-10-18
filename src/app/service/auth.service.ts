import { Injectable, OnInit } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Router } from '@angular/router';

import { throwError, BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { User } from '../Body/login-panel/user.model';

import { BooksService } from './books.service';

import { State as BooksInBagState } from 'src/app/service/store-ngrx/booksInbag.reducer';
import * as BooksInBagActions from 'src/app/service/store-ngrx/booksInbag.actions';
import { TokenService } from './token.service';
import { Observable } from 'rxjs-compat';

// export interface AuthResponseData {
//   localId: string;
//   username: string;
//   email: string;
//   idToken: string;
//   refreshToken: string;
//   expiresIn: string;
//   registered?: boolean;
//   kind: string;
// }

export interface AuthResponseData {
  userId: number;
  idToken: string;
  refreshToken: string;
  expiresIn: string;
}
@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';

  user = new BehaviorSubject<User | null>(null);
  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private booksService: BooksService,
    private store: Store<{ bag: BooksInBagState }>,
    private tokenService: TokenService
  ) {}

  signUp(
    userName: string,
    email: string,
    password: string
  ): Observable<AuthResponseData> {
    const requestData = {
      userName: userName,
      email: email,
      password: password,
      returnSecureToken: true,
    };
    return this.http
      .post<AuthResponseData>(`${this.apiUrl}/register`, requestData)
      .pipe(
        catchError(this.handleError),
        tap((resData: AuthResponseData) => {
          this.handleAuthentication(
            resData.userId,
            resData.idToken,
            resData.refreshToken,
            +resData.expiresIn
          );
        })
      );
  }

  getNewToken(refreshToken: string) {
    // Wyślij żądanie do Twojego serwera w celu odświeżenia tokenu.
    // Zastąp 'twoje_url_odświeżania_tokenu' rzeczywistym adresem URL punktu końcowego serwera do odświeżania tokenu.
    return this.http
      .post<any>('http://localhost:8080/token/refresh', { refreshToken })
      .pipe(
        catchError(this.handleError),
        tap((tokenResponse: any) => {
          // Obsłuż odpowiedź z Twojego serwera i zaktualizuj tokeny, jeśli to konieczne.
          this.tokenService.generateJwtToken(tokenResponse.idToken);
          this.tokenService.generateRefreshToken(tokenResponse.refreshToken);
        })
      );
  }
  login(email: string, password: string) {
    const requestData = {
      email: email,
      password: password,
      returnSecureToken: true,
    };
    return this.http
      .post<AuthResponseData>(`${this.apiUrl}/login`, requestData)
      .pipe(
        catchError(this.handleError),
        tap((resData: AuthResponseData) => {
          this.handleAuthentication(
            resData.userId,
            resData.idToken,
            resData.refreshToken,
            +resData.expiresIn
          );
        })
      );
  }

  autoLogin() {
    const userDataToString: string | null = localStorage.getItem('userData');

    if (!userDataToString) {
      return;
    }

    if (userDataToString !== null) {
      const userData: {
        userId: number;
        _token: string;
        _refreshToken: string;
        _tokenExpirationDate: string;
      } = JSON.parse(userDataToString);

      const loadedUser = new User(
        userData.userId,
        userData._token,
        userData._refreshToken,
        new Date(userData._tokenExpirationDate)
      );

      // if (loadedUser.token) {
      //   this.user.next(loadedUser);
      // }
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/sales-window']);

    // Usuń tokeny z local storage i z TokenService
    this.tokenService.clearTokens();

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
    this.store.dispatch(BooksInBagActions.RemoveAllBooks());
    // this.user.next(null);
    // this.router.navigate(['/sales-window']);
    // // localStorage.clear() // usuwa wszystko
    // localStorage.removeItem('userData'); // usuwa tylko zalogowanego użytkownika
    // if (this.tokenExpirationTimer) {
    //   clearTimeout(this.tokenExpirationTimer);
    // }
    // this.tokenExpirationTimer = null;
    // this.store.dispatch(BooksInBagActions.RemoveAllBooks());
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(
    userId: number,
    idToken: string,
    refreshToken: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(userId, idToken, refreshToken, expirationDate);
    this.user.next(user);
    console.log(user);

    // Przechowuj tokeny w TokenService
    this.tokenService.generateJwtToken(idToken);
    this.tokenService.generateRefreshToken(refreshToken);

    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
    // const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    // const user = new User(id, username, idToken, refreshToken, expirationDate);
    // this.user.next(user);
    // this.autoLogout(expiresIn * 1000);
    // localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (errorRes.error && errorRes.error.error) {
      switch (errorRes.error.error.message) {
        case 'EMAIL_EXISTS':
          errorMessage = 'This email already exists.';
          break;
        case 'EMAIL_NOT_FOUND':
          errorMessage = 'This email does not exist.';
          break;
        case 'INVALID_PASSWORD':
          errorMessage = 'This password is not correct.';
          break;
      }
    } else if (errorRes.error && errorRes.error.message) {
      errorMessage = errorRes.error.message;
    }

    const formattedErrorMessage = `${errorRes.status}: ${errorMessage}`;
    return throwError(formattedErrorMessage);
  }
}
