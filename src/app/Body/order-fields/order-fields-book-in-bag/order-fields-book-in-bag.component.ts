import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { BookModel } from 'src/app/shared/book.model';
import * as fromBooksInBag from 'src/app/service/store-ngrx/booksInbag.selectors';
import { State as BooksInBagState } from 'src/app/service/store-ngrx/booksInbag.reducer';
import * as BooksInBagActions from '../../../service/store-ngrx/booksInbag.actions';
@Component({
  selector: 'app-order-fields-book-in-bag',
  templateUrl: './order-fields-book-in-bag.component.html',
  styleUrls: ['./order-fields-book-in-bag.component.scss'],
})
export class OrderFieldsBookInBagComponent implements OnInit {
  @Output()
  isAsideOpen = new EventEmitter<boolean>();

  public areBooksInBag$: Observable<boolean>;
  public uniqueBooksArr$: Observable<BookModel[]>;
  public lengthBooksInBag$: Observable<number>;
  public ultimatePrice$: Observable<number>;

  constructor(
    private router: Router,
    private store: Store<{ bag: BooksInBagState }>
  ) {}

  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }

  ngOnInit() {
    this.areBooksInBag$ = this.store.select(fromBooksInBag.areBooksInBag);
    this.uniqueBooksArr$ = this.store.select(fromBooksInBag.uniqueBooksInBag);
    this.lengthBooksInBag$ = this.store.select(fromBooksInBag.lengthBooksInBag);
    this.ultimatePrice$ = this.store.select(fromBooksInBag.ultimatePrice);
  }

  countSameBook(bookEl: BookModel) {
    return this.store.select(fromBooksInBag.countSameBooksInBag(bookEl));
  }

  closeAside() {
    this.isAsideOpen.emit(false);
  }
}
// import { Component, EventEmitter, OnInit, Output } from '@angular/core';
// import { Router } from '@angular/router';
// import { BooksService } from 'src/app/service/books.service';
// import { BookModel } from 'src/app/shared/book.model';

// @Component({
//   selector: 'app-order-fields-book-in-bag',
//   templateUrl: './order-fields-book-in-bag.component.html',
//   styleUrls: ['./order-fields-book-in-bag.component.scss'],
// })
// export class OrderFieldsBookInBagComponent implements OnInit {
//   public bagOfBooksArr: BookModel[] = [];
//   public totalCost: any;
//   public uniqueBooksArr: any;
//   uniqueBook: any;
//   public howMoreSameBook: number;

//   @Output()
//   countAllBookInBag = new EventEmitter<number>();
//   @Output()
//   isAsideOpen = new EventEmitter<boolean>();

//   constructor(private bookService: BooksService, private router: Router) {
//     this.bookService.getBagOfBooksObs().subscribe((booksInBag: BookModel[]) => {
//       this.bagOfBooksArr = booksInBag;
//       this.getUniqueBooks();
//       this.countAllBookInBag.emit(this.bagOfBooksArr.length);
//     });
//     this.bookService.getTotalCosts().subscribe((booksInBag: number) => {
//       this.totalCost = booksInBag;
//     });
//   }

//   isActive(route: string): boolean {
//     return this.router.url.includes(route);
//   }

//   ngOnInit() {}

//   closeAside() {
//     this.isAsideOpen.emit(false);
//   }

//   getUniqueBooks() {
//     this.uniqueBooksArr = this.bagOfBooksArr.filter(
//       (book, i, arr) => arr.findIndex((b) => b.author === book.author) === i
//     );
//   }

//   countSameBook(uniqueBook: any) {
//     return (this.howMoreSameBook = this.bagOfBooksArr.filter(
//       (book) => book.title === uniqueBook.title
//     ).length);
//   }
// }
