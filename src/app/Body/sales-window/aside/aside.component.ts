import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { BooksService } from 'src/app/service/books.service';
import { BookModel } from 'src/app/shared/book.model';
import { AuthService } from '../../../service/auth.service';

import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss'],
})
export class AsideComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  private userSub: Subscription;

  public bagOfBooksArr: BookModel[] = [];
  public innerWidth: any;
  public totalCost: any;
  public uniqueBooksArr: any;
  public isBook: boolean;

  // isAuthenticated: boolean;
  isLogin: string;

  @Output()
  countAllBookInBag = new EventEmitter<number>();
  @Output()
  isAsideOpen = new EventEmitter<boolean>();

  constructor(
    private bookService: BooksService,
    private authService: AuthService,
    private router: Router
  ) {
    this.bookService.getBagOfBooksObs().subscribe((booksInBag: BookModel[]) => {
      this.bagOfBooksArr = booksInBag;
      this.getUniqueBooks();
      this.countAllBookInBag.emit(this.bagOfBooksArr.length);
      this.isBook = this.bagOfBooksArr.length > 0 ? true : false;
    });
    this.bookService.getTotalCosts().subscribe((booksInBag: number) => {
      this.totalCost = booksInBag;
    });
  }

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
    this.innerWidth = window.innerWidth;
    if (this.authService.user) {
      this.isLogin = '/login-panel';
    }
    if (!this.authService.user.getValue()) {
      this.isLogin = '/login-panel';
    } else {
      this.isLogin = '/order-fields';
    }
  }

  closeAside() {
    this.isAsideOpen.emit(false);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }

  getUniqueBooks() {
    this.uniqueBooksArr = this.bagOfBooksArr.filter(
      (book, i, arr) => arr.findIndex((b) => b.author === book.author) === i
    );
  }

  clearAllBooks() {
    this.bookService.deleteAllBookFromBag();
    this.bagOfBooksArr = [];
  }

  redirectToLoginPanel(route: string, source: string) {
    const queryParams = { source: source };
    this.router.navigate([route], { queryParams: queryParams });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
