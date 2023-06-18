import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { OrdersService } from 'src/app/service/orders.service';
import { Order } from 'src/app/shared/order.model';
import { User } from '../login-panel/user.model';
import { BooksService } from 'src/app/service/books.service';
import { BookModel } from 'src/app/shared/book.model';
import { BookModelToOrder } from 'src/app/shared/book.model.toorder';
import { AccountSettingsService } from 'src/app/service/account-settings.service';
import { NgForm } from '@angular/forms';
import {
  getUserData,
  userNameResponse,
} from 'src/app/shared/account-user.model';
import { take, first } from 'rxjs/operators';
@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss'],
})
export class UserPanelComponent implements OnInit {
  isAsideOpen: boolean = false;

  userData: getUserData;

  openNgContainer: boolean;

  @ViewChild('f', { static: false })
  signupForm: NgForm;

  countAllBookInBag: number = 0;
  public bagOfBooksArr: BookModel[] = [];
  public BooksModelToOrder: BookModelToOrder[] = [];

  loadedOrders: Order[] = [];
  isFetching = false;
  error: string | null = null;
  user: User | null;

  constructor(
    private bookService: BooksService,
    // private ordersService: OrdersService,
    private authService: AuthService,
    private authAccountSettings: AccountSettingsService
  ) {
    this.authService.user.subscribe((user) => {
      this.user = user;
    });
    this.authAccountSettings
      .getUserData(this.user?.token)
      .subscribe((userData: getUserData) => {
        this.userData = userData;
      });

    this.bookService.getBagOfBooksObs().subscribe((booksInBag: BookModel[]) => {
      this.bagOfBooksArr = booksInBag;
      this.countAllBookInBag = booksInBag.length;
    });
  }

  ngOnInit(): void {}
  openAside() {
    this.isAsideOpen = true;
  }

  changeUserName() {
    const newUserName = this.signupForm.value.setName;
    this.authAccountSettings
      .changeUserName(newUserName, this.user?.token)
      .subscribe((response: userNameResponse) => {
        this.userData.displayName = response.displayName;
      });
    this.signupForm.reset();
  }

  fetchOrders() {
    this.isFetching = true;
    this.authAccountSettings.fetchOrders().subscribe(
      (orders) => {
        this.isFetching = false;
        this.loadedOrders = orders;
      },
      (error) => {
        this.error = error.message;
        console.log(error);
      }
    );
  }

  deleteOrders() {
    this.authAccountSettings.deleteOrders().subscribe(() => {
      this.loadedOrders = [];
    });
  }

  logout() {
    this.authService.logout();
  }
}
