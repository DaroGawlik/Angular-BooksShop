import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { State as BooksInBagState } from 'src/app/service/store-ngrx/booksInbag.reducer';
import {
  AddBook,
  RemoveAllBooks,
  RemoveBook,
  InitBooksInBag,
  SetBooksInBag,
} from './booksInbag.actions';
import { selectBooksInbag } from './booksInbag.selectors';

import { BookModel } from 'src/app/shared/book.model';
@Injectable()
export class BooksInBagEffects {
  constructor(
    private action$: Actions,
    private store: Store<{ bag: BooksInBagState }>
  ) {}

  saveBooksInBag = createEffect(
    () =>
      this.action$.pipe(
        ofType(AddBook, RemoveBook, RemoveAllBooks),
        withLatestFrom(this.store.select(selectBooksInbag)),
        tap(([action, booksInBag]) => {
          const booksInBagString = JSON.stringify(booksInBag);
          localStorage.setItem('booksInBag', booksInBagString);
        })
      ),
    { dispatch: false }
  );
  loadBooksInBag = createEffect(() =>
    this.action$.pipe(
      ofType(InitBooksInBag),
      switchMap(() => {
        const storedBooksInBag = localStorage.getItem('booksInBag');
        if (storedBooksInBag) {
          const booksInBagArray: BookModel[] = JSON.parse(storedBooksInBag);
          return of(SetBooksInBag({ books: booksInBagArray }));
        }
        return of(SetBooksInBag({ books: [] as BookModel[] }));
      })
    )
  );
}
