import { Action, createReducer, on } from '@ngrx/store';
// import { CounterActions, INCREMENT, IncrementAction } from './example.actions';
import { decrement, increment, set } from './example.actions';

export interface State {
  initialState: number;
}

export const initialState: State = {
  initialState: 0,
};

export const counterReducer = createReducer(
  initialState,
  on(increment, (state, action) => ({
    ...state,
    initialState: state.initialState + action.orders,
  })),
  on(decrement, (state, action) => ({
    ...state,
    initialState: state.initialState - action.orders,
  })),
  on(set, (state, action) => ({ ...state, initialState: action.value }))
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
