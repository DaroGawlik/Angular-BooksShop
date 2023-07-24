import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import {
  HttpClient,
  HttpEventType,
  HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { tap, finalize, catchError } from 'rxjs/operators';
import {
  PostUpdateUserNameModel,
  UserDataModel,
  PostUserDataModel,
  GatUpdateUserNameModel,
} from '../shared/account-user.model';
import { AuthService } from './auth.service';
import { User } from '../Body/login-panel/user.model';
import { Order } from '../shared/order.model';

@Injectable({
  providedIn: 'root',
})
export class AccountSettingsService {
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

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.user.subscribe((user) => {
      this.user = user;
      if (this.user?.token) {
        this.getUserData(this.user.token);
      }
    });
  }

  getUserData(idToken: string) {
    this.isFetchingPublic.next(true);
    const requestData: PostUserDataModel = {
      idToken: idToken,
    };
    this.http
      .post<UserDataModel>(
        'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCu0m3745l9Hl1mlAevBNUP84qJuYTVQyU',
        requestData
      )
      .pipe(
        catchError(this.handleError),
        tap((responseData: UserDataModel) => {
          this.userDataSubject.next(responseData);
        }),
        finalize(() => {
          this.isFetchingPublic.next(false);
        })
      )
      .subscribe();
  }

  changeUserName(newUserName: string) {
    this.isFetchingPublic.next(true);
    const requestData: PostUpdateUserNameModel = {
      idToken: this.user?.token || '',
      displayName: newUserName,
    };

    if (this.user?.token) {
      this.http
        .post<UserDataModel>(
          'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCu0m3745l9Hl1mlAevBNUP84qJuYTVQyU',
          requestData
        )
        .pipe(
          catchError(this.handleError),
          tap((responseData: UserDataModel) => {
            const updatedUserData: any = {
              ...this.userDataSubject.value,
              displayName: responseData.displayName,
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
    // let serachParams = new HttpParams();
    // serachParams = serachParams.append('print', 'pretty');
    // serachParams = serachParams.append('custom', 'key');
    this.isFetchingPublic.next(true);
    this.http
      .get<Order>(
        'https://bookshopangular-82a38-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
        {
          // headers: new HttpHeaders({ 'Custom-Header': 'Hello' }),
          // params: serachParams,
          // responseType: 'json',
          //   can change for another format^
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((responseData: Order) => {
          if (responseData) {
            const getUserOrders: Order[] = Object.keys(responseData).map(
              (id) => ({
                id,
                ...responseData[id],
              })
            );
            this.userOrdersSubject.next(getUserOrders);
          }
        }),
        finalize(() => {
          this.isFetchingPublic.next(false);
        })
      )
      .subscribe();
  }

  deleteOrder(idOrder: string) {
    this.isFetchingPublic.next(true);
    this.http
      .delete<{}>(
        `https://bookshopangular-82a38-default-rtdb.europe-west1.firebasedatabase.app/posts/${idOrder}.json/`
      )
      .pipe(
        catchError(this.handleError),
        tap((responseData: any) => {
          // console.log(responseData);
        }),
        finalize(() => {
          const currentOrders = this.userOrdersSubject.getValue() ?? [];
          const filteredOrders = currentOrders.filter(
            (order) => order.id !== idOrder
          );

          this.userOrdersSubject.next(filteredOrders);
          this.isFetchingPublic.next(false);
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
