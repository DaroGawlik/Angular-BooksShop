import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HttpHeadersService {
  private httpOptions: HttpHeaders = new HttpHeaders();

  constructor() {
    this.initHttpOptions();
  }

  private initHttpOptions() {
    this.httpOptions = this.httpOptions.set('Content-Type', 'application/json');
  }

  setAuthorizationToken(token: string) {
    this.httpOptions = this.httpOptions.set('Authorization', `Bearer ${token}`);
  }

  getHttpOptions() {
    return this.httpOptions;
  }
}
