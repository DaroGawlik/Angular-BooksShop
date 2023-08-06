import { BookModel } from 'src/app/shared/book.model';

import { createAction, props } from '@ngrx/store';

export const InitBooksInBag = createAction('[Books in Bag] InitBooksInBag');

export const SetBooksInBag = createAction(
  '[Books in Bag] SetBooksInBag',
  props<{ books: BookModel[] }>()
);

export const AddBook = createAction(
  '[Books in Bag] Add book',
  props<{ book: BookModel }>()
);
export const RemoveBook = createAction(
  '[Books in Bag] Remove book',
  props<{ book: BookModel }>()
);

export const RemoveAllBooks = createAction('[Books in Bag] Remove all books');
