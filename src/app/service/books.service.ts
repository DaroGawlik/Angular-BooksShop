import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import BooksJson from '../../books.json';

@Injectable()
export class BooksService {
  private defaultBooks: Array<object> = [];
  private bagOfBooks: Array<object> = [];

  private bagOfBooksObs = new BehaviorSubject<Array<object>>(this.bagOfBooks);

  constructor() {
    this.defaultBooks = BooksJson;
    this.bagOfBooksObs.next(this.bagOfBooks);
  }

  addTobagList(book: object) {
    this.bagOfBooks.push(book);
    this.bagOfBooksObs.next(this.bagOfBooks);
  }

  getDefaultBooks() {
    return this.defaultBooks.slice();
  }

  getBagOfBooksObs(): Observable<Array<object>> {
    return this.bagOfBooksObs.asObservable();
  }
}
