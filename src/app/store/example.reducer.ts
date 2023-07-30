import { Action, createReducer, on } from '@ngrx/store';
// import { CounterActions, INCREMENT, IncrementAction } from './example.actions';
import { decrement, increment } from './example.actions';

const initialState = 0;

// APROACH 1

export const counterRedcuer = createReducer(
  initialState,
  on(increment, (state, action) => action.orders),
  on(decrement, (state, action) => state - action.order)
);

// createReducer() from @ngrx/store crates such a reducer function under the hood

// APPROACH 2

// export function counterRedcuer(
//   state = initialState,
//   action: CounterActions | Action
// ) {
//   if (action.type === INCREMENT) {
//     return (action as IncrementAction).orders;
//   }
//   return state;
// }
