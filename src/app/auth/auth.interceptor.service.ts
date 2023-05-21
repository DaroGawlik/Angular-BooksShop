import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';

export class AuthInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('Request is on its way');
    console.log(req.url);
    const modifedRequest = req.clone({
      headers: req.headers.append('auth', 'xyz'),
    });
    return next.handle(modifedRequest);
  }
}
