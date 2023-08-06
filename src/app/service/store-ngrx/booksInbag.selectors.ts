import { createSelector, createFeatureSelector, State } from '@ngrx/store';
import { BookModel } from 'src/app/shared/book.model';
import { State as BooksInBagState } from './booksInbag.reducer';

export const selectBooksInBagState =
  createFeatureSelector<BooksInBagState>('bag');

export const selectBooksInbag = createSelector(
  selectBooksInBagState,
  (state: BooksInBagState) => state.booksInbag
);

export const areBooksInBag = createSelector(
  selectBooksInbag,
  (booksInbag: BookModel[]) => booksInbag?.length > 0
);

export const uniqueBooksInBag = createSelector(
  selectBooksInbag,
  (booksInbag: BookModel[]) =>
    booksInbag.filter(
      (book, i, arr) => arr.findIndex((b) => b.author === book.author) === i
    )
);

export const lengthBooksInBag = createSelector(
  selectBooksInbag,
  (booksInbag: BookModel[]) => booksInbag?.length
);

export const countSameBooksInBag = (bookItem: BookModel) =>
  createSelector(
    selectBooksInbag,
    (booksInbag: BookModel[]) =>
      booksInbag?.filter((book) => book.title === bookItem.title).length
  );

export const ultimatePrice = createSelector(
  selectBooksInbag,
  (booksInBag: BookModel[]) =>
    booksInBag?.reduce((totalPrice, book) => totalPrice + book.price, 0)
);
