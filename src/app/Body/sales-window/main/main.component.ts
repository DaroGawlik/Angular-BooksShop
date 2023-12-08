import { Component, OnInit } from '@angular/core';

import { BooksService } from 'src/app/service/books.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  Books: Array<object> = [];

  constructor(private booksService: BooksService) {
    this.Books = this.booksService.getDefaultBooks();
  }

  ngOnInit() {}
}
