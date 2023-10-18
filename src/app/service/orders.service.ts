import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { tap, finalize, catchError } from 'rxjs/operators';
import { Order } from '../shared/order.model';
import { AuthService } from './auth.service';
import { AccountSettingsService } from './account-settings.service';
import { User } from '../Body/login-panel/user.model';
import { HttpHeadersService } from './httpHeaders.service';
@Injectable({ providedIn: 'root' })
export class OrdersService {
  private user: User | null;

  private apiUrl = 'http://localhost:8080/order';
  error = new Subject<string>();

  public isFetchingPublic = new Subject<boolean>();
  public errorPublic = new Subject<string>();

  public isAfterOrderWindowPopup = new BehaviorSubject<boolean>(false);
  public orderResponse = new BehaviorSubject<string>("");

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private accountSettingsService: AccountSettingsService,
    private httpHeadersService: HttpHeadersService
  ) {
    this.authService.user.subscribe((user) => {
      this.user = user;
    });
  }

  createAndStoreOrder(requestData: Order) {
    this.isFetchingPublic.next(true);
    const httpOptions = this.httpHeadersService.getHttpOptions();
    if (!this.user) {
      this.error.next('User not identified');
      return;
    }
    const userApiUrl = `${this.apiUrl}/${this.user.userId}/post`;
    this.http
      .post(userApiUrl, requestData, {
        headers: httpOptions,
        responseType: 'text',
      })
      .pipe(catchError(this.handleError))
      .subscribe((responseData: string) => {
        this.orderResponse.next(responseData)
        this.accountSettingsService.canFetchOrders.next(true);
        this.isAfterOrderWindowPopup.next(true);
        this.isFetchingPublic.next(false);
      });
  }

  private handleError = (errorRes: HttpErrorResponse) => {
    let errorMessage = errorRes.message;
    this.errorPublic.next(errorMessage);
    return throwError(errorMessage);
  };
}

// createAndStoreOrder(postData: Order) {
//   this.http
//     .post<{ orderData: object }>(
//       // 'https://bookshopangular-82a38-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
//       `https://bookshopangular-82a38-default-rtdb.europe-west1.firebasedatabase.app/users/${this.user.id}.json`,
//       // https://bookshopangular-82a38-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}.json
//       postData
//       // {
//       //   observe: 'response',
//       // }
//     )
//     .subscribe(
//       (responseData) => {
//         // console.log(responseData);
//         this.accountSettingsService.canFetchOrders.next(true);
//         this.isAfteorderWindowOpen.next(true);
//       },
//       (error) => {
//         this.error.next(error.message);
//       }
//     );
// }
