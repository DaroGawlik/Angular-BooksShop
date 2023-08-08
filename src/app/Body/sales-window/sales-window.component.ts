import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { AccountSettingsService } from 'src/app/service/account-settings.service';
import { State as BooksInBagState } from 'src/app/service/store-ngrx/booksInbag.reducer';
import { lengthBooksInBag } from 'src/app/service/store-ngrx/booksInbag.selectors';

@Component({
  selector: 'app-sales-window',
  templateUrl: './sales-window.component.html',
  styleUrls: ['./sales-window.component.scss'],
})
export class SalesWindowComponent implements OnInit {
  booksInBagLength$: Observable<number>;
  isAsideOpen: boolean = false;

  isLogoutWindowOpen: boolean;
  isFetching: boolean;
  error: string;

  constructor(
    private store: Store<{ bag: BooksInBagState }>,
    private accountSettingsService: AccountSettingsService
  ) {
    this.accountSettingsService.isLogoutWindowPopup.subscribe(
      (isLogoutWindowOpen: boolean) => {
        this.isLogoutWindowOpen = isLogoutWindowOpen;
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

  ngOnInit() {
    this.booksInBagLength$ = this.store.select(lengthBooksInBag);
  }

  openAside() {
    this.isAsideOpen = true;
  }

  closeLogoutPopup() {
    this.accountSettingsService.isLogoutWindowPopup.next(false);
  }
}
// import { BooksService } from 'src/app/service/books.service';
// import { BookModel } from 'src/app/shared/book.model';

// @Component({
//   selector: 'app-sales-window',
//   templateUrl: './sales-window.component.html',
//   styleUrls: ['./sales-window.component.scss'],
// })
// export class SalesWindowComponent implements OnInit {
//   public bagOfBooksArr: BookModel[] = [];
//   countAllBookInBag: number = 0;
//   isAsideOpen: boolean = false;

//   constructor(private bookService: BooksService) {
//     this.bookService.getBagOfBooksObs().subscribe((booksInBag: BookModel[]) => {
//       this.countAllBookInBag = booksInBag.length;
//     });
//   }

//   ngOnInit() {}

//   openAside() {
//     this.isAsideOpen = true;
//   }
// }
