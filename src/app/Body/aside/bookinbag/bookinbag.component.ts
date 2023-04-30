import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BooksService } from 'src/app/service/books.service';
import { BookModel } from 'src/app/shared/book.model';

@Component({
  selector: 'app-bookinbag',
  templateUrl: './bookinbag.component.html',
  styleUrls: ['./bookinbag.component.scss'],
})
export class BookinbagComponent implements OnInit {
  @Input() bookItem: any = {};
  private bagOfBooks: BookModel[];
  howMoreSameBook: number = 0;
  dupa: object;

  constructor(private bookService: BooksService) {
    this.bookService.getBagOfBooksObs().subscribe((booksInBag: BookModel[]) => {
      this.bagOfBooks = booksInBag;
      this.countSameBook();
    });
  }

  ngOnInit() {}

  moreSameBook(): string {
    return this.howMoreSameBook > 0 ? '' : 'right';
  }

  countSameBook() {
    this.howMoreSameBook = this.bagOfBooks.filter(
      (book) => book.title === this.bookItem.title
    ).length;
    console.log(this.howMoreSameBook);
  }
}
