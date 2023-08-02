import { Action, createReducer, on } from '@ngrx/store';
import { BookModel } from 'src/app/shared/book.model';
import * as BooksInBagActions from './booksInbag.actions';

export interface State {
  booksInbag: BookModel[];
}

const initialState: State = {
  booksInbag: [],
};
export const booksInBagReducer = createReducer(
  initialState,
  on(BooksInBagActions.AddBook, (state, action) => ({
    ...state,
    booksInbag: [...state.booksInbag, action.book],
  }))
);
