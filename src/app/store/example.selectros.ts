import { createSelector } from '@ngrx/store';

export const selectOrders = (state: { example: number }) => state.example;
export const selectDoubleOrders = createSelector(
  selectOrders,
  (state: number) => state * 2
);
