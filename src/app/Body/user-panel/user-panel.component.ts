import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { OrdersService } from 'src/app/service/orders.service';
import { Order } from 'src/app/shared/order.model';
import { UserDataModel } from '../../shared/account-user.model';
import { BooksService } from 'src/app/service/books.service';
import { BookModel } from 'src/app/shared/book.model';
import { BookModelToOrder } from 'src/app/shared/book.model.toorder';
import { AccountSettingsService } from 'src/app/service/account-settings.service';
import { NgForm } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss'],
})
export class UserPanelComponent implements OnInit {
  isAsideOpen: boolean = false;

  userData: UserDataModel | null;
  userOrders: Order[] | null;
  selectedUserOrder: Order | null;

  openNgContainer: string = '';

  @ViewChild('f', { static: false })
  signupForm: NgForm;

  countAllBookInBag: number = 0;
  public bagOfBooksArr: BookModel[] = [];
  public BooksModelToOrder: BookModelToOrder[] = [];

  isFetching: boolean;
  error: string;

  constructor(
    private bookService: BooksService,
    private authService: AuthService,
    private router: Router,
    private accountSettingsService: AccountSettingsService
  ) {
    this.bookService.getBagOfBooksObs().subscribe((booksInBag: BookModel[]) => {
      this.bagOfBooksArr = booksInBag;
      this.countAllBookInBag = booksInBag.length;
    });
    this.accountSettingsService.userDataPublic.subscribe(
      (userData: UserDataModel | null) => {
        this.userData = userData;
      }
    );
    this.accountSettingsService.userOrdersPublic.subscribe(
      (userOrders: Order[] | null) => {
        this.userOrders = userOrders;
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
  }

  ngOnInit() {}
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
