import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { tap, finalize, catchError } from 'rxjs/operators';
import { Order } from '../shared/order.model';
import { AuthService } from './auth.service';
import { AccountSettingsService } from './account-settings.service';
import { User } from '../Body/login-panel/user.model';
@Injectable({ providedIn: 'root' })
export class OrdersService {
  user: User;
  error = new Subject<string>();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private accountSettingsService: AccountSettingsService
  ) {
    this.authService.user.subscribe((user) => {
      if (user !== null) {
        this.user = user;
      }
    });
  }

  createAndStoreOrder(postData: Order) {
    this.http
      .post<{ orderData: object }>(
        // 'https://bookshopangular-82a38-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
        `https://bookshopangular-82a38-default-rtdb.europe-west1.firebasedatabase.app/users/${this.user.id}.json`,
        // https://bookshopangular-82a38-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}.json
        postData
        // {
        //   observe: 'response',
        // }
      )
      .subscribe(
        (responseData) => {
          // console.log(responseData);
          this.accountSettingsService.canFetchOrders.next(true);
        },
        (error) => {
          this.error.next(error.message);
        }
      );
  }
}
