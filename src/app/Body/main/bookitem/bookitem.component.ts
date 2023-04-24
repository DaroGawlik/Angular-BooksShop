import { Component, Input, OnInit } from '@angular/core';
import { BooksService } from 'src/app/service/books.service';

@Component({
  selector: 'app-bookitem',
  templateUrl: './bookitem.component.html',
  styleUrls: ['./bookitem.component.scss'],
})
export class BookitemComponent implements OnInit {
  @Input() bookItem: any;
  isMoreInfoOpen: boolean = false;

  constructor(private booksService: BooksService) {}

  ngOnInit(): void {}

  openMoreInfo() {
    this.isMoreInfoOpen = true;
  }
  closeMoreInfo() {
    this.isMoreInfoOpen = false;
  }

  addBookToBag() {
    this.booksService.addTobagList(this.bookItem);
  }
}
