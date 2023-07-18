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
import {} from 'src/app/shared/account-user.model';
import { Subscription } from 'rxjs';
// import '../../shared/loading-spinner/loading-spinner.component';
@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss'],
})
export class UserPanelComponent implements OnInit {
  isAsideOpen: boolean = false;

  userData: UserDataModel | null;
  userOrders: Order[];

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
      (userOrders: Order[]) => {
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
    this.accountSettingsService.fetchOrders();
  }

  // deleteOrders() {
  //   this.authAccountSettings.deleteOrders().subscribe(() => {
  //     this.loadedOrders = [];
  //   });
  // }

  logout() {
    this.authService.logout();
  }

  // ngOnDestroy() {
  //   this.isFetchingSubscription.unsubscribe();
  // }
}
