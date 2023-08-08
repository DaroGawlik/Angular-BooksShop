import { createSelector } from '@ngrx/store';
import { AppState } from '../store-ngrx/app.reducer';

export const selectOrders = (state: AppState) => state.example.initialState;
export const selectDoubleOrders = createSelector(
  selectOrders,
  (orders: number) => orders * 2
);
