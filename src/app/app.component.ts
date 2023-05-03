import { Component, OnInit } from '@angular/core';
import { BooksService } from './service/books.service';
import { BookModel } from './shared/book.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'BooksShop-Project-Angular';
  public bagOfBooksArr: BookModel[] = [];
  countAllBookInBag: number = 0;
  isAsideOpen: boolean = false;

  constructor(private bookService: BooksService) {
    this.bookService.getBagOfBooksObs().subscribe((booksInBag: BookModel[]) => {
      this.countAllBookInBag = booksInBag.length;
    });
  }

  ngOnInit() {}

  openAside() {
    this.isAsideOpen = true;
  }
}
