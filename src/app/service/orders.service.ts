import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';

import { Order } from '../shared/order.model';
import { AuthService } from './auth.service';
@Injectable({ providedIn: 'root' })
export class OrdersService {
  error = new Subject<string>();

  constructor(private http: HttpClient, private authService: AuthService) {}

  createAndStoreOrder(postData: Order) {
    // const orderData: Order = {};
    this.http
      .post<{ orderData: object }>(
        'https://bookshopangular-82a38-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
        postData
        // {
        //   observe: 'response',
        // }
      )
      .subscribe(
        (responseData) => {
          console.log(responseData);
        },
        (error) => {
          this.error.next(error.message);
        }
      );
  }
}
