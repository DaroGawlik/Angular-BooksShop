import { Component, OnInit } from '@angular/core';
import { BooksService } from 'src/app/service/books.service';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss'],
})
export class AsideComponent implements OnInit {
  public bagOfBooks: Array<object> = [];

  constructor(private bookService: BooksService) {
    this.bookService
      .getBagOfBooksObs()
      .subscribe((booksInBag: Array<object>) => {
        this.bagOfBooks = booksInBag;
        console.log(this.bagOfBooks);
      });
  }

  ngOnInit(): void {}
}
