import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpEventType,
} from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

import { Order } from '../shared/order.model';
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

  fetchOrders() {
    // let serachParams = new HttpParams();
    // serachParams = serachParams.append('print', 'pretty');
    // serachParams = serachParams.append('custom', 'key');
    return this.http
      .get<{ [key: string]: Order }>(
        'https://bookshopangular-82a38-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
        {
          // headers: new HttpHeaders({ 'Custom-Header': 'Hello' }),
          //   params: new HttpParams().set('print', 'pretty'),
          // params: serachParams,
          // responseType: 'json',
          //   can change for another format^
        }
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
    return this.http
      .delete(
        'https://bookshopangular-82a38-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
        { observe: 'events' }
      )
      .pipe(
        tap((event) => {
          console.log(event);
          if (event.type === HttpEventType.Sent) {
            //...
          }
          if (event.type === HttpEventType.Response) {
            console.log(event.body);
          }
        })
      );
  }
}
