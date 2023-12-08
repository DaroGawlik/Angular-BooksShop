import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FetchingService {
  public isFetchingSubject = new BehaviorSubject<boolean>(false);
  public isFetching$: Observable<boolean> =
    this.isFetchingSubject.asObservable();
  constructor() {}
}
