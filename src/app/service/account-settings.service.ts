import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Order } from '../shared/order.model';
import { userName } from '../shared/changeUserName.model';

@Injectable({
  providedIn: 'root',
})
export class AccountSettingsService {
  constructor(private http: HttpClient) {}

  changeUserName(newUserName: string, idToken: string | null | undefined) {
    this.http
      .post<{ orderData: object }>(
        'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCu0m3745l9Hl1mlAevBNUP84qJuYTVQyU',
        {
          idToken: idToken,
          displayName: newUserName,
          returnSecureToken: true,
        }
      )
      .subscribe((responseData) => {
        console.log(responseData);
      });
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
