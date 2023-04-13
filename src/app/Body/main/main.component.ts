import { Component, OnInit, Input } from '@angular/core';
import { BookModel } from '../book.model';
import BooksJson from '../../../books.json';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  Books: [] = BooksJson;

  constructor() {}

  ngOnInit() {
    console.log(this.Books);
  }
}
