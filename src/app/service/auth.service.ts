import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs-compat';
import { finalize, tap } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { State as BooksInBagState } from 'src/app/service/store-ngrx/booksInbag.reducer';
import * as BooksInBagActions from 'src/app/service/store-ngrx/booksInbag.actions';

import { TokenService } from './token.service';
import { FetchingService } from './fetching.service';

import { User } from '../shared/user.model';

import { ApiConfig } from 'src/api/api.config';
export interface AuthResponseData {
  userId: number;
  idToken: string;
  refreshToken: string;
  expiresIn: string;
}
@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrlAuth: string;

  public user = new BehaviorSubject<User | null>(null);

  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<{ bag: BooksInBagState }>,
    private tokenService: TokenService,
    private fetchingService: FetchingService
  ) {
    this.apiUrlAuth = ApiConfig.apiUrlAuth;
  }

  signUp(
    userName: string,
    email: string,
    password: string
  ): Observable<AuthResponseData> {
    this.fetchingService.isFetchingSubject.next(true);

    const requestData = { userName, email, password, returnSecureToken: true };

    return this.http
      .post<AuthResponseData>(`${this.apiUrlAuth}/register`, requestData)
      .pipe(
        tap(
          ({ userId, idToken, refreshToken, expiresIn }: AuthResponseData) => {
            this.handleAuthentication(
              userId,
              idToken,
              refreshToken,
              +expiresIn
            );
          }
        ),
        finalize(() => {
          this.fetchingService.isFetchingSubject.next(false);
        })
      );
  }

  getNewToken(refreshToken: string) {
    return this.http
      .post<any>('http://localhost:8080/token/refresh', { refreshToken })
      .pipe(
        tap((tokenResponse: any) => {
          this.tokenService.generateJwtToken(tokenResponse.idToken);
          this.tokenService.generateRefreshToken(tokenResponse.refreshToken);
        })
      );
  }
  login(email: string, password: string) {
    const requestData = { email, password, returnSecureToken: true };
    return this.http
      .post<AuthResponseData>(`${this.apiUrlAuth}/login`, requestData)
      .pipe(
        tap(
          ({ userId, idToken, refreshToken, expiresIn }: AuthResponseData) => {
            this.handleAuthentication(
              userId,
              idToken,
              refreshToken,
              +expiresIn
            );
          }
        )
      );
  }

  autoLogin() {
    const userDataString: string | null = localStorage.getItem('userData');

    if (!userDataString) {
      return;
    }

    const userData: {
      userId: number;
      _token: string;
      _refreshToken: string;
      _tokenExpirationDate: string;
    } = JSON.parse(userDataString);

    const loadedUser = new User(
      userData.userId,
      userData._token,
      userData._refreshToken,
      new Date(userData._tokenExpirationDate)
    );

    this.user.next(loadedUser);

    const expirationDuration =
      new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
    this.autoLogout(expirationDuration);
  }

  logout() {
    // Clear user and navigate to the sales window
    this.user.next(null);
    this.router.navigate(['/sales-window']);

    // Clear tokens from local storage and TokenService
    this.tokenService.clearTokens();

    // Clear the token expiration timer
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }

    // Dispatch action to remove all books from the bag
    this.store.dispatch(BooksInBagActions.RemoveAllBooks());
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(
      () => this.logout(),
      expirationDuration
    );
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
    this.tokenService.generateJwtToken(idToken);
    this.tokenService.generateRefreshToken(refreshToken);
    this.autoLogout(expiresIn * 1000);

    localStorage.setItem('userData', JSON.stringify(user));
  }
}
