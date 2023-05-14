import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  HostListener,
} from '@angular/core';
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

  constructor(private bookService: BooksService) {
    this.bookService.getBagOfBooksObs().subscribe((booksInBag: BookModel[]) => {
      this.bagOfBooksArr = booksInBag;
      this.getUniqueBooks();
      this.countAllBookInBag.emit(this.bagOfBooksArr.length);
    });
    this.bookService.getTotalCosts().subscribe((booksInBag: number) => {
      this.totalCost = booksInBag;
    });
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
