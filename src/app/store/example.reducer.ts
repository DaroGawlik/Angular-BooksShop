import { createReducer } from '@ngrx/store';

const initialState = 0;

// export const counterRedcuer = createReducer(initialState);

// createReducer() from @ngrx/store crates such a reducer function under the hood 

export function counterRedcuer(state = initialState) {
  return state;
}
