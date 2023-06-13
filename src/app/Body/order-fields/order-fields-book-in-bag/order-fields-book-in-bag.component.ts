import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BooksService } from 'src/app/service/books.service';
import { BookModel } from 'src/app/shared/book.model';

@Component({
  selector: 'app-order-fields-book-in-bag',
  templateUrl: './order-fields-book-in-bag.component.html',
  styleUrls: ['./order-fields-book-in-bag.component.scss'],
})
export class OrderFieldsBookInBagComponent implements OnInit {
  public bagOfBooksArr: BookModel[] = [];
  public totalCost: any;
  public uniqueBooksArr: any;
  uniqueBook: any;
  public howMoreSameBook: number;

  @Output()
  countAllBookInBag = new EventEmitter<number>();
  @Output()
  isAsideOpen = new EventEmitter<boolean>();

  constructor(private bookService: BooksService, private router: Router) {
    this.bookService.getBagOfBooksObs().subscribe((booksInBag: BookModel[]) => {
      this.bagOfBooksArr = booksInBag;
      this.getUniqueBooks();
      this.countAllBookInBag.emit(this.bagOfBooksArr.length);
      console.log(this.uniqueBooksArr);
    });
    this.bookService.getTotalCosts().subscribe((booksInBag: number) => {
      this.totalCost = booksInBag;
    });
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }

  ngOnInit() {}

  closeAside() {
    this.isAsideOpen.emit(false);
  }

  getUniqueBooks() {
    this.uniqueBooksArr = this.bagOfBooksArr.filter(
      (book, i, arr) => arr.findIndex((b) => b.author === book.author) === i
    );
  }

  countSameBook(uniqueBook: any) {
    return (this.howMoreSameBook = this.bagOfBooksArr.filter(
      (book) => book.title === uniqueBook.title
    ).length);
  }
}
