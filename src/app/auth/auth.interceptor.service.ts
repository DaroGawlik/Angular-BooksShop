import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpParams,
} from '@angular/common/http';
import { take, exhaustMap } from 'rxjs/operators';
import { AuthService } from '../Body/login-panel/auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        if (!user) {
          return next.handle(req);
        }

        let modifiedReq = req;
        if (user.token) {
          modifiedReq = req.clone({
            params: new HttpParams().set('auth', user.token),
          });
        }

        return next.handle(modifiedReq);
      })
    );
  }
}

//   intercept(req: HttpRequest<any>, next: HttpHandler) {
//     // console.log('Request is on its way');
//     // console.log(req.url);
//     const modifedRequest = req.clone({
//       headers: req.headers.append('auth', 'xyz'),
//     });
//     return next.handle(modifedRequest);
//   }
