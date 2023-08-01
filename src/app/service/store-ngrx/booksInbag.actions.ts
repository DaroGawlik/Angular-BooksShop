import { Action } from '@ngrx/store';

import { BookModel } from 'src/app/shared/book.model';

import { createAction, props } from '@ngrx/store';

export const AddBook = createAction(
  '[Books in Bag] Add book',
  props<{ book: BookModel }>()
);
