import { ActionReducerMap } from '@ngrx/store';
import * as fromBooksInBag from '../service/store-ngrx/booksInbag.reducer';
import * as fromCounter from '../store-example/example.reducer';

export interface AppState {
  example: fromCounter.State;
  bag: fromBooksInBag.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  example: fromCounter.counterReducer,
  bag: fromBooksInBag.booksInBagReducer,
};
