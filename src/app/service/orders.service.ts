import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../shared/order.model';
import { map, catchError } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  createAndStoreOrder(postData: Order) {
    // const orderData: Order = {};
    this.http
      .post<{ orderData: object }>(
        'https://bookshopangular-82a38-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
        postData
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

  fetchOrders() {
    return this.http
      .get<{ [key: string]: Order }>(
        'https://bookshopangular-82a38-default-rtdb.europe-west1.firebasedatabase.app/posts.json'
      )
      .pipe(
        map((responseData) => {
          const postsArray: Order[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
              console.log(responseData);
              console.log(postsArray);
            }
          }
          return postsArray;
        }),
        catchError((errorRes) => {
          // Send to analytics server
          return throwError(errorRes);
        })
      );
  }

  deleteOrders() {
    return this.http.delete(
      'https://bookshopangular-82a38-default-rtdb.europe-west1.firebasedatabase.app/posts.json'
    );
  }
}
