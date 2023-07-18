import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
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

  private userOrdersSubject = new BehaviorSubject<Order[]>([]);
  public userOrdersPublic: Observable<Order[]> =
    this.userOrdersSubject.asObservable();

  private isFetchingSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public isFetchingPublic = this.isFetchingSubject.asObservable();

  private errorSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );
  public errorPublic = this.errorSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.user.subscribe((user) => {
      this.user = user;
      if (this.user?.token) {
        this.getUserData(this.user.token);
      }
    });
  }

  getUserData(idToken: string) {
    this.isFetchingSubject.next(true);
    const requestData: PostUserDataModel = {
      idToken: idToken,
    };
    this.http
      .post<UserDataModel>(
        'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCu0m3745l9Hl1mlAevBNUP84qJuYTVQyU',
        requestData
      )
      .pipe(
        // catchError(this.handleError),
        tap((responseData: UserDataModel) => {
          this.userDataSubject.next(responseData);
        }),
        finalize(() => {
          this.isFetchingSubject.next(false);
        })
      )
      .subscribe();
  }

  changeUserName(newUserName: string) {
    this.isFetchingSubject.next(true);
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
          // catchError(this.handleError),
          tap((responseData: UserDataModel) => {
            const updatedUserData: any = {
              ...this.userDataSubject.value,
              displayName: responseData.displayName,
            };
            this.userDataSubject.next(updatedUserData);
          }),
          finalize(() => {
            this.isFetchingSubject.next(false);
          })
        )
        .subscribe();
    }
  }

  fetchOrders() {
    // let serachParams = new HttpParams();
    // serachParams = serachParams.append('print', 'pretty');
    // serachParams = serachParams.append('custom', 'key');
    this.isFetchingSubject.next(true);
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
            const getUserOrders: Order[] = Object.values(responseData);
            this.userOrdersSubject.next(getUserOrders);
          }
        }),
        finalize(() => {
          this.isFetchingSubject.next(false);
        })
      )
      .subscribe();
  }

  private handleError = (errorRes: HttpErrorResponse) => {
    let errorMessage = 'An unknown error occurred!';
    if (errorRes.error && errorRes.error.error) {
      errorMessage = 'Error occurred: ' + errorRes.error.error.message;
    }
    this.errorSubject.next(errorMessage);
    return throwError(errorMessage);
  };
}

//   deleteOrders() {
//     return this.http
//       .delete(
//         'https://bookshopangular-82a38-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
//         { observe: 'events' }
//       )
//       .pipe(
//         tap((event) => {
//           console.log(event);
//           if (event.type === HttpEventType.Sent) {
//             //...
//           }
//           if (event.type === HttpEventType.Response) {
//             console.log(event.body);
//           }
//         })
//       );
//   }
// }
