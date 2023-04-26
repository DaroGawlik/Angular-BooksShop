import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  HostListener,
} from '@angular/core';
import { BooksService } from 'src/app/service/books.service';
import { BookModel } from 'src/app/shared/book.model';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss'],
})
export class AsideComponent implements OnInit {
  public bagOfBooks: BookModel[];
  public innerWidth: any;
  public totalCost: number;

  @Output()
  isAsideOpen = new EventEmitter<boolean>();

  constructor(private bookService: BooksService) {
    this.bookService.getBagOfBooksObs().subscribe((booksInBag: BookModel[]) => {
      this.bagOfBooks = booksInBag;
    });
    this.totalCost = this.bookService.getTotalCosts();
    console.log(this.totalCost);
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
  }
}
