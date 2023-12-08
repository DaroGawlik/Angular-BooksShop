// NGRX APPROACH

import { Component, OnInit, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import * as BooksInBagActions from '../../../../service/store-ngrx/booksInbag.actions';
import { State } from 'src/app/service/store-ngrx/booksInbag.reducer';

@Component({
  selector: 'app-bookitem',
  templateUrl: './bookitem.component.html',
  styleUrls: ['./bookitem.component.scss'],
})
export class BookitemComponent implements OnInit {
  @Input() bookItem: any;
  isMoreInfoOpen: boolean = false;

  constructor(private store: Store<State>) {}

  ngOnInit(): void {}

  openMoreInfo() {
    this.isMoreInfoOpen = true;
  }
  closeMoreInfo() {
    this.isMoreInfoOpen = false;
  }

  addBookToBag() {
    this.store.dispatch(BooksInBagActions.AddBook({ book: this.bookItem }));
  }
}

///////////////////////////////////////////////////////////////////////////////////////////

// import { Component, OnInit, Input } from '@angular/core';
// import { BooksService } from 'src/app/service/books.service';

// @Component({
//   selector: 'app-bookitem',
//   templateUrl: './bookitem.component.html',
//   styleUrls: ['./bookitem.component.scss'],
// })
// export class BookitemComponent implements OnInit {
//   @Input() bookItem: any;
//   isMoreInfoOpen: boolean = false;

//   constructor(private booksService: BooksService) {}

//   ngOnInit(): void {}

//   openMoreInfo() {
//     this.isMoreInfoOpen = true;
//   }
//   closeMoreInfo() {
//     this.isMoreInfoOpen = false;
//   }

//   addBookToBag() {
//     this.booksService.addTobagList(this.bookItem);
//   }
// }
