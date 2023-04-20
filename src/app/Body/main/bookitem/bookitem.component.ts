import { Component, Input, OnInit } from '@angular/core';
import { BookModel } from '../../book.model';

@Component({
  selector: 'app-bookitem',
  templateUrl: './bookitem.component.html',
  styleUrls: ['./bookitem.component.scss'],
})
export class BookitemComponent implements OnInit {
  @Input() bookItem: any;
  isMoreInfoOpen: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  openMoreInfo() {
    this.isMoreInfoOpen = true;
  }
  closeMoreInfo() {
    this.isMoreInfoOpen = false;
  }

  addBookToBag() {}
}
