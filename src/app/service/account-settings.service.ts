import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { finalize, map } from 'rxjs/operators';
import {
  PostUpdateUserNameModel,
  UserDataModel,
  GetUpdateUserNameModel,
} from '../shared/account-user.model';
import { AuthService } from './auth.service';
import { User } from '../shared/user.model';
import { Order } from '../shared/order.model';
import { Store } from '@ngrx/store';
import { increment, decrement } from '../store/example.actions';
import { HttpHeadersService } from './httpHeaders.service';
import { PopUpService } from './popup.service';
import { ErrorHandlerService } from './errorHandler.service';
import { FetchingService } from './fetching.service';

@Injectable({
  providedIn: 'root',
})
export class AccountSettingsService {
  user: User;

  private apiUrl = 'http://localhost:8080';
  private apiUrlOrder = 'http://localhost:8080/order';

  private userDataSubject = new BehaviorSubject<UserDataModel | null>(null);
  public userDataPublic: Observable<UserDataModel | null> =
    this.userDataSubject.asObservable();

  private userOrdersSubject = new BehaviorSubject<Order[] | null>(null);
  public userOrdersPublic: Observable<Order[] | null> =
    this.userOrdersSubject.asObservable();

  public canFetchOrders = new BehaviorSubject<boolean>(true);

  private httpOptions = this.httpHeadersService.getHttpOptions();
  private requestDataSecureToken = {
    request: true,
  };

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private store: Store,
    private httpHeadersService: HttpHeadersService,
    private popUp: PopUpService,
    private errorService: ErrorHandlerService,
    private fetchingService: FetchingService
  ) {
    this.authService.user.subscribe((user) => {
      if (user) {
        this.user = user;
        this.getUserData(this.user.userId);
      }
    });
  }

  getUserData(userId: number) {
    this.fetchingService.isFetchingSubject.next(true);
    this.http
      .post<UserDataModel>(`${this.apiUrl}/userData/${userId}/get`, null, {
        headers: this.httpOptions,
      })
      .pipe(
        finalize(() => {
          this.fetchingService.isFetchingSubject.next(false);
        })
      )
      .subscribe((response: UserDataModel) => {
        const updatedUserData: Partial<UserDataModel> = {
          ...this.userDataSubject.value,
          userName: response.userName,
        };
        this.userDataSubject.next(updatedUserData as UserDataModel);
      });
  }

  changeUserName(userName: string) {
    this.fetchingService.isFetchingSubject.next(true);
    const requestData: PostUpdateUserNameModel = {
      userName: userName,
    };
    this.http
      .put<GetUpdateUserNameModel>(
        `${this.apiUrl}/userData/${this.user.userId}/updateUserName`,
        requestData,
        { headers: this.httpOptions }
      )
      .pipe(
        finalize(() => {
          this.fetchingService.isFetchingSubject.next(false);
        })
      )
      .subscribe((response: GetUpdateUserNameModel) => {
        const updatedUserData: Partial<UserDataModel> = {
          ...this.userDataSubject.value,
          userName: response.userName,
        };
        this.userDataSubject.next(updatedUserData as UserDataModel);
      });
  }

  fetchOrders() {
    this.fetchingService.isFetchingSubject.next(true);
    const userApiUrl = `${this.apiUrlOrder}/${this.user.userId}/get`;

    this.http
      .get<Order[]>(userApiUrl, {
        headers: this.httpOptions,
        params: this.requestDataSecureToken,
      })
      .pipe(
        finalize(() => {
          this.fetchingService.isFetchingSubject.next(false);
        })
      )
      .subscribe((response: Order[]) => {
        this.userOrdersSubject.next(response);
        this.store.dispatch(increment({ orders: response.length }));
      });
  }

  deleteOrder(orderId: number): Observable<boolean> {
    this.fetchingService.isFetchingSubject.next(true);
    const userApiUrl = `${this.apiUrlOrder}/${this.user.userId}/delete/${orderId}`;

    return this.http
      .delete(userApiUrl, {
        headers: this.httpOptions,
        params: this.requestDataSecureToken,
        responseType: 'text',
      })
      .pipe(
        finalize(() => {
          this.fetchingService.isFetchingSubject.next(false);
        }),
        map((response: string) => {
          const currentOrders = this.userOrdersSubject.getValue() ?? [];
          const filteredOrders = currentOrders.filter(
            (order) => order.orderId !== orderId
          );
          this.userOrdersSubject.next(filteredOrders);
          this.store.dispatch(decrement({ orders: 1 }));
          this.popUp.isOpen.next(true);
          this.popUp.response.next(response);
          return true;
        })
      );
  }

  deleteUser() {
    this.fetchingService.isFetchingSubject.next(true);
    this.http
      .delete(`${this.apiUrl}/auth/users/delete/${this.user.userId}`, {
        ...this.httpOptions,
        responseType: 'text',
      })
      .pipe(
        finalize(() => {
          this.fetchingService.isFetchingSubject.next(false);
        })
      )
      .subscribe((response: string) => {
        this.popUp.response.next(response);
        this.userOrdersSubject.next(null);
        this.popUp.isOpen.next(true);
      });
  }
}
