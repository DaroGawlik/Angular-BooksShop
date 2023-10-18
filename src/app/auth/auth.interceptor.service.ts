import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpClient,
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { take, exhaustMap, catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { AuthService } from '../service/auth.service';
import { TokenService } from '../service/token.service';
import { TokenResponse } from '../shared/token.model';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private httpClient: HttpClient
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        if (!user) {
          return next.handle(req);
        }

        // Użyj TokenService do pobrania JWT tokena
        const jwtToken = this.tokenService.getJwtToken();

        if (jwtToken && this.tokenService.isJwtTokenValid()) {
          req = this.addTokenToRequest(req, jwtToken);
        }

        return next.handle(req).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              return this.handle401Error(req, next);
            } else {
              return throwError(error);
            }
          })
        );
      })
    );
  }

  private addTokenToRequest(
    request: HttpRequest<any>,
    token: string
  ): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handle401Error(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('Handling 401 Error');
    const refreshToken = this.tokenService.getRefreshToken();
    console.log('Refresh Token:', refreshToken);
    if (refreshToken) {
      return this.authService.getNewToken(refreshToken).pipe(
        switchMap((tokenResponse: TokenResponse) => {
          this.tokenService.clearTokens();
          this.tokenService.generateJwtToken(tokenResponse.authenticationToken);
          this.tokenService.generateRefreshToken(tokenResponse.refreshToken);
          const newRequest = this.addTokenToRequest(
            req,
            tokenResponse.authenticationToken
          );
          return next.handle(newRequest);
        }),

        catchError(() => {
          return throwError('Token refresh error');
        })
      );
    } else {
      return throwError('No refreshToken in local storage');
    }
  }
}

// @Injectable()
// export class AuthInterceptorService implements HttpInterceptor {
//   constructor(
//     private authService: AuthService,
//     private tokenService: TokenService
//   ) {}

//   intercept(req: HttpRequest<any>, next: HttpHandler) {
//     return this.authService.user.pipe(
//       take(1),
//       // sprawdzamy czy user jest zalogowany czy nie (sprawdzi pierwszą wartość); take(3) => sprawdzi pierwsze trzy(niezależnie czy jest zalogowany czy nie)
//       exhaustMap((user) => {
//         //operuje na zwróconym obiekcie, czeka aż poprzednia operacja "take(1)" się wykona. Używamy w przypadku gdy chcemy ograniczyć równoległe wykonywanie operacji i zapewniamy sobie sekwencyjność.
//         if (!user) {
//           // console.log(req);
//           return next.handle(req);
//         }

//         let modifiedReq = req;
//         // Użyj TokenService do pobrania JWT tokena
//         const jwtToken = this.tokenService.getJwtToken();

//         if (jwtToken && this.tokenService.isJwtTokenValid()) {
//           modifiedReq = req.clone({
//             setHeaders: {
//               Authorization: `Bearer ${jwtToken}`,
//             },
//           });
//         }

//         // if (user.token) {
//         //   modifiedReq = req.clone({
//         //     params: new HttpParams().set('auth', user.token),
//         //   });
//         //   // console.log(modifiedReq);
//         // }

//         return next.handle(modifiedReq);
//       })
//     );
//   }
// }
