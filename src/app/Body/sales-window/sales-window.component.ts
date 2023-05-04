import { Component, OnInit } from '@angular/core';
import { BooksService } from 'src/app/service/books.service';
import { BookModel } from 'src/app/shared/book.model';

@Component({
  selector: 'app-sales-window',
  templateUrl: './sales-window.component.html',
  styleUrls: ['./sales-window.component.scss'],
})
export class SalesWindowComponent implements OnInit {
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
