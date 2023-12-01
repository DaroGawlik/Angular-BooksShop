import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject, throwError } from 'rxjs';
import {
  HttpHeaders,
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { tap, finalize, catchError, filter, switchMap } from 'rxjs/operators';
import {
  PostUpdateUserNameModel,
  UserDataModel,
  GetUpdateUserNameModel,
} from '../shared/account-user.model';
import { AuthService } from './auth.service';
import { User } from '../Body/login-panel/user.model';
import { Order } from '../shared/order.model';
import { Store } from '@ngrx/store';
import { increment, decrement } from '../store/example.actions';
import { HttpHeadersService } from './httpHeaders.service';

// import { IncrementAction } from '../store/example.actions';
@Injectable({
  providedIn: 'root',
})
export class AccountSettingsService {
  private apiUrl = 'http://localhost:8080';
  private apiUrlOrder = 'http://localhost:8080/order';

  user: User | null;
  private userDataSubject = new BehaviorSubject<UserDataModel | null>(null);
  public userDataPublic: Observable<UserDataModel | null> =
    this.userDataSubject.asObservable();

  private userOrdersSubject = new BehaviorSubject<Order[] | null>(null);
  public userOrdersPublic: Observable<Order[] | null> =
    this.userOrdersSubject.asObservable();

  public canFetchOrders = new BehaviorSubject<boolean>(true);

  public isFetchingPublic = new Subject<boolean>();
  public errorPublic = new Subject<string>();

  public isLogoutWindowPopup = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private store: Store,
    private httpHeadersService: HttpHeadersService
  ) {
    this.authService.user.subscribe((user) => {
      this.user = user;
      if (this.user?.userId) {
        this.getUserData(this.user.userId);
      }
    });
  }

  getUserData(userId: number) {
    const httpOptions = this.httpHeadersService.getHttpOptions();
    this.http
      .post<UserDataModel>(`${this.apiUrl}/userData/${userId}/get`, null, {
        headers: httpOptions,
      })
      .pipe(
        catchError(this.handleError),
        tap((responseData: UserDataModel) => {
          const updatedUserData: any = {
            ...this.userDataSubject.value,
            userName: responseData.userName,
          };
          this.userDataSubject.next(updatedUserData);
        }),
        finalize(() => {
          this.isFetchingPublic.next(false);
        })
      )
      .subscribe();
  }

  changeUserName(userName: string) {
    this.isFetchingPublic.next(true);
    if (this.user?.userId) {
      const requestData: PostUpdateUserNameModel = {
        userName: userName,
      };
      const httpOptions = this.httpHeadersService.getHttpOptions();

      this.http
        .put<GetUpdateUserNameModel>(
          `${this.apiUrl}/userData/${this.user.userId}/updateUserName`,
          requestData,
          { headers: httpOptions }
        )
        .pipe(
          catchError(this.handleError),
          tap((responseData: GetUpdateUserNameModel) => {
            const updatedUserData: any = {
              ...this.userDataSubject.value,
              userName: responseData.userName,
            };
            this.userDataSubject.next(updatedUserData);
          }),
          finalize(() => {
            this.isFetchingPublic.next(false);
          })
        )
        .subscribe();
    }
  }

  fetchOrders() {
    this.isFetchingPublic.next(true);
    if (!this.user) {
      this.errorPublic.next('User not identified');
      this.isFetchingPublic.next(false);
      return;
    }

    const httpOptions = this.httpHeadersService.getHttpOptions();
    const requestData = {
      returnSecureToken: true,
    };
    const userApiUrl = `${this.apiUrlOrder}/${this.user.userId}/get`;

    this.http
      .get<Order[]>(userApiUrl, { headers: httpOptions, params: requestData })
      .pipe(
        catchError((error) => {
          this.handleError(error);
          throw error;
        }),
        finalize(() => {
          this.isFetchingPublic.next(false);
        })
      )
      .subscribe((response: Order[]) => {
        this.userOrdersSubject.next(response);
        this.store.dispatch(increment({ orders: response.length }));
      });
  }
  deleteOrder(orderId: number) {
    this.isFetchingPublic.next(true);
    if (!this.user) {
      this.errorPublic.next('User not identified');
      this.isFetchingPublic.next(false);
      return;
    }

    const httpOptions = this.httpHeadersService.getHttpOptions();
    const requestData = {
      returnSecureToken: true,
    };
    const userApiUrl = `${this.apiUrlOrder}/${this.user.userId}/delete/${orderId}`;
    console.log('1');
    this.http
      .delete(userApiUrl, { headers: httpOptions, params: requestData })
      .pipe(
        catchError((error) => {
          this.handleError(error);
          throw error;
        }),
        finalize(() => {
          const currentOrders = this.userOrdersSubject.getValue() ?? [];
          const filteredOrders = currentOrders.filter(
            (order) => order.id !== orderId
          );

          this.userOrdersSubject.next(filteredOrders);
          this.store.dispatch(decrement({ orders: 1 }));
          this.isFetchingPublic.next(false);
        })
      )
      .subscribe();
  }

  deleteUser() {
    this.isFetchingPublic.next(true);
    if (!this.user) {
      console.error('User data is missing.');
      this.isFetchingPublic.next(false); // Zakończ tutaj, ponieważ brakuje danych użytkownika
      return;
    }
    const httpOptions = this.httpHeadersService.getHttpOptions();
    this.http
      .delete(`${this.apiUrl}/auth/users/delete/${this.user.userId}`, {
        ...httpOptions,
        responseType: 'text',
      })
      .pipe(
        catchError(this.handleError),
        tap((responseData: string) => {
          // console.log(responseData);
        }),
        finalize(() => {
          this.isFetchingPublic.next(false);
          this.userOrdersSubject.next(null);
          this.isLogoutWindowPopup.next(true);
        })
      )
      .subscribe();
  }

  private handleError = (errorRes: HttpErrorResponse) => {
    let errorMessage = errorRes.message;
    this.errorPublic.next(errorMessage);
    return throwError(errorMessage);
  };
}
