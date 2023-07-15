import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { tap } from 'rxjs/operators';
import {
  PostUpdateUserNameModel,
  UserDataModel,
  PostUserDataModel,
} from '../shared/account-user.model';
import { AuthService } from './auth.service';
import { User } from '../Body/login-panel/user.model';

@Injectable({
  providedIn: 'root',
})
export class AccountSettingsService {
  user: User | null;
  private userDataSubject = new BehaviorSubject<UserDataModel | null>(null);
  public userDataPublic: Observable<UserDataModel | null> =
    this.userDataSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.user.subscribe((user) => {
      this.user = user;
      if (this.user?.token) {
        this.getUserData(this.user.token);
      }
    });
  }

  getUserData(idToken: string) {
    const requestData: PostUserDataModel = {
      idToken: idToken,
    };
    this.http
      .post<UserDataModel>(
        'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCu0m3745l9Hl1mlAevBNUP84qJuYTVQyU',
        requestData
      )
      .pipe(
        tap((responseData: UserDataModel) => {
          this.userDataSubject.next(responseData);
        })
      )
      .subscribe();
  }

  changeUserName(newUserName: string) {
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
        .subscribe((responseData: UserDataModel) => {
          const updatedUserData: any = {
            ...this.userDataSubject.value,
            displayName: responseData.displayName,
          };
          this.userDataSubject.next(updatedUserData);
        });
    }
  }
}

//   fetchOrders() {
//     // let serachParams = new HttpParams();
//     // serachParams = serachParams.append('print', 'pretty');
//     // serachParams = serachParams.append('custom', 'key');

//     return this.http
//       .get<{ [key: string]: Order }>(
//         'https://bookshopangular-82a38-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
//         {
//           // headers: new HttpHeaders({ 'Custom-Header': 'Hello' }),
//           // params: serachParams,
//           // responseType: 'json',
//           //   can change for another format^
//         }
//       )
//       .pipe(
//         map((responseData) => {
//           const postsArray: Order[] = [];
//           for (const key in responseData) {
//             if (responseData.hasOwnProperty(key)) {
//               postsArray.push({ ...responseData[key], id: key });
//               console.log(responseData);
//               console.log(postsArray);
//             }
//           }
//           return postsArray;
//         }),
//         catchError((errorRes) => {
//           // Send to analytics server
//           return throwError(errorRes);
//         })
//       );
//   }

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
