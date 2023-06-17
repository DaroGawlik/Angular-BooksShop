import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Order } from '../shared/order.model';
import { userName, userNameResponse } from '../shared/account-user.model';

@Injectable({
  providedIn: 'root',
})
export class AccountSettingsService {
  constructor(private http: HttpClient) {}

  changeUserName(newUserName: string, idToken: string | null | undefined) {
    const requestData: userName = {
      idToken: idToken!,
      displayName: newUserName,
      returnSecureToken: true,
    };

    return this.http.post<userNameResponse>(
      'https://identitytoolkit.googleapis.com/v1/accounts:update?key=YOUR_API_KEY',
      requestData
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
