import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { decrement, increment, init, set } from './example.actions';
import { selectOrders } from './example.selectros';
import { AppState } from '../store-ngrx/app.reducer';
import * as fromApp from '../store-ngrx/app.reducer';

@Injectable()
export class ExampleEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromApp.AppState>
  ) {}

  load = createEffect(() =>
    this.actions$.pipe(
      ofType(init),
      switchMap(() => {
        const storedExample = localStorage.getItem('example');
        if (storedExample) {
          return of(set({ value: +storedExample }));
        }
        return of(set({ value: 0 }));
      })
    )
  );
  saveExample = createEffect(
    () =>
      this.actions$.pipe(
        ofType(increment, decrement),
        withLatestFrom(this.store.select(selectOrders)),
        tap(([action, example]) => {
          localStorage.setItem('example', example.toString());
        })
      ),
    { dispatch: false }
  );
}
