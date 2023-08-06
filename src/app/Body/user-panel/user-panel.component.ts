import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { Order } from 'src/app/shared/order.model';
import { UserDataModel } from '../../shared/account-user.model';
import { AccountSettingsService } from 'src/app/service/account-settings.service';
import { NgForm } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { State as BooksInBagState } from 'src/app/service/store-ngrx/booksInbag.reducer';
import * as fromBooksInBag from 'src/app/service/store-ngrx/booksInbag.selectors';
import * as fromExample from 'src/app/store/example.selectros';
@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss'],
})
export class UserPanelComponent implements OnInit {
  isAsideOpen: boolean = false;

  userData: UserDataModel | null;
  userOrders: Order[];
  selectedUserOrder: Order | null;

  countOrders$: Observable<number>;
  countOrdersDouble$: Observable<number>;
  lengthBooksInBag$: Observable<number>;

  openNgContainer: string = '';

  @ViewChild('f', { static: false })
  signupForm: NgForm;

  isFetching: boolean;
  error: string;

  constructor(
    private authService: AuthService,
    private accountSettingsService: AccountSettingsService,
    private store: Store<{ example: number; bag: BooksInBagState }>
  ) {
    this.accountSettingsService.userDataPublic.subscribe(
      (userData: UserDataModel | null) => {
        this.userData = userData;
      }
    );
    this.accountSettingsService.userOrdersPublic.subscribe(
      (userOrders: Order[] | null) => {
        this.userOrders = userOrders !== null ? userOrders : this.userOrders;
      }
    );
    this.accountSettingsService.isFetchingPublic.subscribe(
      (isFetching: boolean) => {
        this.isFetching = isFetching;
      }
    );
    this.accountSettingsService.errorPublic.subscribe((error: string) => {
      this.error = error;
    });
    this.countOrders$ = this.store.select(fromExample.selectOrders);
    this.countOrdersDouble$ = this.store.select(fromExample.selectDoubleOrders);
  }

  ngOnInit() {
    this.lengthBooksInBag$ = this.store.select(fromBooksInBag.lengthBooksInBag);
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
    this.selectedUserOrder =
      this.selectedUserOrder === userOrder ? null : userOrder;
  }

  cancelOrder(userOrder: Order) {
    userOrder?.id && this.accountSettingsService.deleteOrder(userOrder.id);
  }

  deleteAccount() {
    this.accountSettingsService.deleteAccountApi();
    this.logout();
  }

  logout() {
    this.authService.logout();
  }

  removeError() {
    this.accountSettingsService.errorPublic.next('');
  }
}
