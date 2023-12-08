import { Component, OnInit, ViewChild } from '@angular/core';

import { NgForm } from '@angular/forms';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { State as BooksInBagState } from 'src/app/service/store-ngrx/booksInbag.reducer';
import * as fromBooksInBag from 'src/app/service/store-ngrx/booksInbag.selectors';
import * as fromExample from 'src/app/store/example.selectros';

import { AccountSettingsService } from 'src/app/service/account-settings.service';
import { AuthService } from 'src/app/service/auth.service';
import { PopUpService } from 'src/app/service/popup.service';
import { ErrorHandlerService } from 'src/app/service/errorHandler.service';
import { FetchingService } from 'src/app/service/fetching.service';

import { UserDataModel } from '../../shared/account-user.model';
import { Order } from 'src/app/shared/order.model';
@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss'],
})
export class UserPanelComponent implements OnInit {
  isAsideOpen: boolean = false;
  isAfteorderWindowOpen: boolean;
  userData: UserDataModel;
  userOrders: Order[];
  selectedUserOrder: Order | null;

  countOrders$: Observable<number>;
  countOrdersDouble$: Observable<number>;
  lengthBooksInBag$: Observable<number>;

  isFetching$: Observable<boolean>;
  source: string;
  error$: Observable<string | null>;

  openNgContainer: string = '';

  @ViewChild('f', { static: false })
  signupForm: NgForm;

  constructor(
    private authService: AuthService,
    private accountSettingsService: AccountSettingsService,
    private store: Store<{ example: number; bag: BooksInBagState }>,
    private popUp: PopUpService,
    private errorService: ErrorHandlerService,
    private fetchingService: FetchingService
  ) {
    this.accountSettingsService.userDataPublic.subscribe((userData) => {
      if (userData) {
        this.userData = userData;
      }
    });
    this.error$ = this.errorService.error$;
    this.isFetching$ = this.fetchingService.isFetching$;
    this.accountSettingsService.userOrdersPublic.subscribe((userOrders) => {
      this.userOrders = userOrders !== null ? userOrders : this.userOrders;
    });
    this.countOrders$ = this.store.select(fromExample.selectOrders);
    this.countOrdersDouble$ = this.store.select(fromExample.selectDoubleOrders);
  }

  ngOnInit(): void {
    this.lengthBooksInBag$ = this.store.select(fromBooksInBag.lengthBooksInBag);
    this.onClearError();
  }

  openAside() {
    this.isAsideOpen = true;
  }

  changeUserName() {
    const newUserName = this.signupForm.value.setName;
    this.accountSettingsService.changeUserName(newUserName);
    this.signupForm.reset();
  }

  fetchOrders() {
    if (this.accountSettingsService.canFetchOrders.getValue()) {
      this.accountSettingsService.fetchOrders();
      this.accountSettingsService.canFetchOrders.next(false);
    }
  }
  selectUserOrder(userOrder: Order) {
    this.selectedUserOrder = userOrder;
  }

  deleteOrder(userOrder: Order) {
    this.accountSettingsService
      .deleteOrder(userOrder.orderId)
      .subscribe((success) => success && (this.selectedUserOrder = null));
  }

  deleteAccount() {
    this.accountSettingsService.deleteUser();
    this.logout();
  }

  logout() {
    this.authService.logout();
    this.accountSettingsService.canFetchOrders.next(true);
    localStorage.removeItem('userData');
    this.popUp.isOpen.next(true);
    this.popUp.response.next('Logout was successful');
  }

  onClearError(): void {
    this.errorService.clearErrorService();
  }
}
