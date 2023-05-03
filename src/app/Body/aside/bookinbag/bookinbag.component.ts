import { Component, OnInit, Input, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BooksService } from 'src/app/service/books.service';
import { BookModel } from 'src/app/shared/book.model';

@Component({
  selector: 'app-bookinbag',
  templateUrl: './bookinbag.component.html',
  styleUrls: ['./bookinbag.component.scss'],
})
@Injectable()
export class BookinbagComponent implements OnInit {
  @Input() bookItem: any = {};
  private bagOfBooks: BookModel[];
  howMoreSameBook: number;

  constructor(private bookService: BooksService) {
    this.bookService.getBagOfBooksObs().subscribe((booksInBag: BookModel[]) => {
      this.bagOfBooks = booksInBag;
      this.countSameBook();
    });
  }

  ngOnInit() {
    this.countSameBook();
  }

  countSameBook() {
    this.howMoreSameBook = this.bagOfBooks.filter(
      (book) => book.title === this.bookItem.title
    ).length;
  }

  deleteBook() {
    let index = this.bagOfBooks.findIndex(
      (book) => book.title === this.bookItem.title
    );
    this.bookService.deleteBookFromBag(index, this.bookItem.price);
    this.countSameBook();
  }
}
