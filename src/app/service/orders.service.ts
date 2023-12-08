import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { AccountSettingsService } from './account-settings.service';
import { HttpHeadersService } from './httpHeaders.service';
import { PopUpService } from './popup.service';
import { FetchingService } from './fetching.service';

import { Order } from '../shared/order.model';
import { User } from '../shared/user.model';

import { ApiConfig } from 'src/api/api.config';
@Injectable({ providedIn: 'root' })
export class OrdersService {
  private apiUrlOrder: string;
  private user: User;

  public isAfterOrderWindowPopup = new BehaviorSubject<boolean>(false);
  public orderResponse = new BehaviorSubject<string>('');

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private accountSettingsService: AccountSettingsService,
    private httpHeadersService: HttpHeadersService,
    private popUp: PopUpService,
    private fetchingService: FetchingService
  ) {
    this.apiUrlOrder = ApiConfig.apiUrlOrder;
    this.authService.user.subscribe((user) =>
      user !== null ? (this.user = user) : null
    );
  }

  createAndStoreOrder(requestData: Order) {
    this.fetchingService.isFetchingSubject.next(true);
    const httpOptions = this.httpHeadersService.getHttpOptions();
    const userApiUrl = `${this.apiUrlOrder}/${this.user.userId}/post`;
    this.http
      .post(userApiUrl, requestData, {
        headers: httpOptions,
        responseType: 'text',
      })
      .pipe(
        finalize(() => {
          this.fetchingService.isFetchingSubject.next(false);
        })
      )
      .subscribe((response: string) => {
        this.popUp.response.next(response);
        this.accountSettingsService.canFetchOrders.next(true);
        this.popUp.isOpen.next(true);
      });
  }
}
