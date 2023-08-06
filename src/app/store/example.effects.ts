import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { decrement, increment, init, set } from './example.actions';
import { selectOrders } from './example.selectros';

@Injectable()
export class ExampleEffects {
  constructor(
    private actions$: Actions,
    private store: Store<{ example: number }>
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
