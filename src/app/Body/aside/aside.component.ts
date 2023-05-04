// import {
//   Component,
//   EventEmitter,
//   OnInit,
//   Output,
//   HostListener,
// } from '@angular/core';
// import { BooksService } from 'src/app/service/books.service';
// import { BookModel } from 'src/app/shared/book.model';

// @Component({
//   selector: 'app-aside',
//   templateUrl: './aside.component.html',
//   styleUrls: ['./aside.component.scss'],
// })
// export class AsideComponent implements OnInit {
//   public bagOfBooksArr: BookModel[] = [];
//   public innerWidth: any;
//   public totalCost: any;
//   public uniqueBooksArr: any;

//   @Output()
//   countAllBookInBag = new EventEmitter<number>();
//   @Output()
//   isAsideOpen = new EventEmitter<boolean>();

//   constructor(private bookService: BooksService) {
//     this.bookService.getBagOfBooksObs().subscribe((booksInBag: BookModel[]) => {
//       this.bagOfBooksArr = booksInBag;
//       this.getUniqueBooks();
//       this.countAllBookInBag.emit(this.bagOfBooksArr.length);
//     });
//     this.bookService.getTotalCosts().subscribe((booksInBag: number) => {
//       this.totalCost = booksInBag;
//     });
//   }

//   ngOnInit() {
//     this.innerWidth = window.innerWidth;
//   }

//   closeAside() {
//     this.isAsideOpen.emit(false);
//   }

//   @HostListener('window:resize', ['$event'])
//   onResize() {
//     this.innerWidth = window.innerWidth;
//   }

//   getUniqueBooks() {
//     this.uniqueBooksArr = this.bagOfBooksArr.filter(
//       (book, i, arr) => arr.findIndex((b) => b.author === book.author) === i
//     );
//   }

//   confirmOrder() {}

//   clearAllBooks() {
//     this.bookService.deleteAllBookFromBag();
//     this.bagOfBooksArr = [];
//   }
// }
