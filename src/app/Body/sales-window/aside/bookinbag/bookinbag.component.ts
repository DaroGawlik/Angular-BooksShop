import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { BooksService } from 'src/app/service/books.service';
import { BookModel } from 'src/app/shared/book.model';
import { State as BooksInBagState } from 'src/app/service/store-ngrx/booksInbag.reducer';
import { countSameBooksInBag } from 'src/app/service/store-ngrx/booksInbag.selectors';
import * as BooksInBagActions from '../../../../service/store-ngrx/booksInbag.actions';

@Component({
  selector: 'app-bookinbag',
  templateUrl: './bookinbag.component.html',
  styleUrls: ['./bookinbag.component.scss'],
})
export class BookinbagComponent implements OnInit {
  @Input() bookItem: BookModel;
  private bagOfBooks: BookModel[];
  public innerWidth: any;
  public howMoreSameBook$: Observable<number>;
  constructor(
    private bookService: BooksService,
    private store: Store<{ bag: BooksInBagState }>
  ) {
    this.bookService.getBagOfBooksObs().subscribe((booksInBag: BookModel[]) => {
      this.bagOfBooks = booksInBag;
    });
  }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.howMoreSameBook$ = this.store.select(
      countSameBooksInBag(this.bookItem)
    );
  }

  removeBook() {
    this.store.dispatch(BooksInBagActions.RemoveBook({ book: this.bookItem }));

    let index = this.bagOfBooks.findIndex(
      (book) => book.title === this.bookItem.title
    );
    // this.bookService.deleteBookFromBag(index, this.bookItem.price);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }
}
// import {
//   Component,
//   OnInit,
//   Input,
//   HostListener,
// } from '@angular/core';
// import { BooksService } from 'src/app/service/books.service';
// import { BookModel } from 'src/app/shared/book.model';

// @Component({
//   selector: 'app-bookinbag',
//   templateUrl: './bookinbag.component.html',
//   styleUrls: ['./bookinbag.component.scss'],
// })
// export class BookinbagComponent implements OnInit {
//   @Input() bookItem: any = {};
//   private bagOfBooks: BookModel[];
//   public innerWidth: any;
//   public howMoreSameBook: number;

//   constructor(private bookService: BooksService) {
//     this.bookService.getBagOfBooksObs().subscribe((booksInBag: BookModel[]) => {
//       this.bagOfBooks = booksInBag;
//       this.countSameBook();
//     });
//   }

//   ngOnInit() {
//     this.innerWidth = window.innerWidth;
//     this.countSameBook();
//   }

//   countSameBook() {
//     this.howMoreSameBook = this.bagOfBooks.filter(
//       (book) => book.title === this.bookItem.title
//     ).length;
//   }

//   deleteBook() {
//     let index = this.bagOfBooks.findIndex(
//       (book) => book.title === this.bookItem.title
//     );
//     this.bookService.deleteBookFromBag(index, this.bookItem.price);
//     this.countSameBook();
//   }

//   @HostListener('window:resize', ['$event'])
//   onResize() {
//     this.innerWidth = window.innerWidth;
//   }
// }
