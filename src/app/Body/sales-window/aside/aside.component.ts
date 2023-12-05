import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { AuthService } from '../../../service/auth.service';
import { BookModel } from 'src/app/shared/book.model';

import * as fromBooksInBag from 'src/app/service/store-ngrx/booksInbag.selectors';
import { State as BooksInBagState } from 'src/app/service/store-ngrx/booksInbag.reducer';
import * as BooksInBagActions from '../../../service/store-ngrx/booksInbag.actions';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss'],
})

// NGRX APPROACH
export class AsideComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  private userSub: Subscription;

  public areBooksInBag$: Observable<boolean>;
  public uniqueBooksArr$: Observable<BookModel[]>;
  public ultimatePrice$: Observable<number>;

  public innerWidth: any;

  isLogin: string;

  @Output()
  isAsideOpen = new EventEmitter<boolean>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<{ bag: BooksInBagState }>
  ) {}

  ngOnInit() {
    this.areBooksInBag$ = this.store.select(fromBooksInBag.areBooksInBag);
    this.uniqueBooksArr$ = this.store.select(fromBooksInBag.uniqueBooksInBag);
    this.ultimatePrice$ = this.store.select(fromBooksInBag.ultimatePrice);
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
    this.innerWidth = window.innerWidth;

    if (!this.isAuthenticated) {
      this.isLogin = '/login-panel';
    } else {
      this.isLogin = '/order-fields';
    }
  }

  clearAllBooks() {
    this.store.dispatch(BooksInBagActions.RemoveAllBooks());
  }

  closeAside() {
    this.isAsideOpen.emit(false);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }

  redirectToLoginPanel(route: string, source: string) {
    const queryParams = { source: source };
    this.router.navigate([route], { queryParams: queryParams });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
