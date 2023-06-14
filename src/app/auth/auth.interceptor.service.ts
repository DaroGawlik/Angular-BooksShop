import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpParams,
} from '@angular/common/http';
import { take, exhaustMap } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.user.pipe(
      take(1),
      // sprawdzamy czy user jest zalogowany czy nie (sprawdzi pierwszą wartość); take(3) => sprawdzi pierwsze trzy(niezależnie czy jest zalogowany czy nie)
      exhaustMap((user) => {
        //operuje na zwróconym obiekcie, czeka aż poprzednia operacja "take(1)" się wykona. Używamy w przypadku gdy chcemy ograniczyć równoległe wykonywanie operacji i zapewniamy sobie sekwencyjność.
        if (!user) {
          // console.log(req);
          return next.handle(req);
        }

        let modifiedReq = req;
        if (user.token) {
          modifiedReq = req.clone({
            params: new HttpParams().set('auth', user.token),
          });
          // console.log(modifiedReq);
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
