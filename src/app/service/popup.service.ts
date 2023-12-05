import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class PopUpService {
  public isOpen = new BehaviorSubject<boolean>(false);
  public response = new BehaviorSubject<string>('');
  constructor() {}
}
