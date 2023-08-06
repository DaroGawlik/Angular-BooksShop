import { Component, OnInit } from '@angular/core';
import { AuthService } from './service/auth.service';
import { Store } from '@ngrx/store';
import { init } from './store/example.actions';
import { InitBooksInBag } from './service/store-ngrx/booksInbag.actions';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'BooksShop-Project-Angular';

  constructor(private authService: AuthService, private store: Store) {}

  ngOnInit() {
    this.authService.autoLogin();
    this.store.dispatch(init());
    this.store.dispatch(InitBooksInBag());
  }
}
