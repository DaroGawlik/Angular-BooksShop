import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import { BooksService } from 'src/app/service/books.service';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss'],
})
export class AsideComponent implements OnInit {
  public bagOfBooks: Array<object> = [];
  public innerWidth: any;

  @Output()
  isAsideOpen = new EventEmitter<boolean>();

  constructor(private bookService: BooksService) {
    this.bookService
      .getBagOfBooksObs()
      .subscribe((booksInBag: Array<object>) => {
        this.bagOfBooks = booksInBag;
        console.log(this.bagOfBooks);
      });
  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
  }

  closeAside() {
    this.isAsideOpen.emit(false);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
    console.log(this.innerWidth);
  }
}
