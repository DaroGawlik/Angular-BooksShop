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
    // let serachParams = new HttpParams();
    // serachParams = serachParams.append('print', 'pretty');
    // serachParams = serachParams.append('custom', 'key');
    this.isFetchingPublic.next(true);
    this.authService.user
      .pipe(
        filter((user): user is User => !!user), // Filtrujemy użytkowników, żeby pominąć null i undefined
        switchMap((user) =>
          this.http.get<Order>(
            `https://bookshopangular-82a38-default-rtdb.europe-west1.firebasedatabase.app/users/${user.userId}.json`,
            {
              // headers: new HttpHeaders({ 'Custom-Header': 'Hello' }),
              // params: serachParams,
              // responseType: 'json',
              //   can change for another format^
            }
          )
        ),
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
            this.store.dispatch(increment({ orders: getUserOrders.length }));
            // this.store.dispatch(new IncrementAction(getUserOrders.length));
          }
          this.isFetchingPublic.next(false);
        })
        // finalize(() => {
        //   this.isFetchingPublic.next(false);
        //   // NIE WYWOŁUJE SIĘ
        // })
      )
      .subscribe();
  }

  deleteOrder(idOrder: string) {
    this.isFetchingPublic.next(true);
    if (this.user) {
      this.http
        .delete<{}>(
          `https://bookshopangular-82a38-default-rtdb.europe-west1.firebasedatabase.app/users/${this.user.userId}/${idOrder}.json`
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
            this.store.dispatch(decrement({ orders: 1 }));
            this.isFetchingPublic.next(false);
          })
        )
        .subscribe();
    }
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

  // deleteAccountApi() {
  //   this.isFetchingPublic.next(true);

  //   if (this.user) {
  //     const requestData: PostUserDataModel = {
  //       idToken: this.user.token || '',
  //     };

  //     this.http
  //       .delete<{}>(
  //         `https://bookshopangular-82a38-default-rtdb.europe-west1.firebasedatabase.app/users/${this.user.id}.json`
  //       )
  //       .pipe(
  //         catchError(this.handleError),
  //         tap((responseData: any) => {
  //           if (responseData == null) {
  //             this.http
  //               .post<PostUserDataModel>(
  //                 'https://identitytoolkit.googleapis.com/v1/accounts:delete?key=AIzaSyCu0m3745l9Hl1mlAevBNUP84qJuYTVQyU',
  //                 requestData
  //               )
  //               .subscribe();
  //           }
  //         }),
  //         finalize(() => {
  //           this.isFetchingPublic.next(false);
  //           this.userOrdersSubject.next(null);
  //           this.isLogoutWindowPopup.next(true);
  //         })
  //       )
  //       .subscribe();
  //   }
  // }

  private handleError = (errorRes: HttpErrorResponse) => {
    let errorMessage = errorRes.message;
    this.errorPublic.next(errorMessage);
    return throwError(errorMessage);
  };
}
