import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import BooksJson from '../../books.json';
import { BookModel } from '../shared/book.model';
import { from } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable()
export class BooksService {
  private defaultBooks: BookModel[] = [];
  private bagOfBooks: BookModel[] = [];
  private totalCost: number = 0;

  private bagOfBooksObs = new BehaviorSubject<BookModel[]>(this.bagOfBooks);
  private totalCostObs = new BehaviorSubject<number>(this.totalCost);

  constructor() {
    this.defaultBooks = BooksJson;
    this.bagOfBooksObs.next(this.bagOfBooks);
    this.totalCostObs.next(this.totalCost);
  }

  addTobagList(book: BookModel) {
    this.bagOfBooks.push(book);
    this.bagOfBooksObs.next(this.bagOfBooks);

    this.totalCost += book.price;
    this.totalCostObs.next(this.totalCost);
  }

  getDefaultBooks() {
    return this.defaultBooks.slice();
  }

  getBagOfBooksObs(): Observable<BookModel[]> {
    return this.bagOfBooksObs.asObservable();
  }

  getTotalCosts(): Observable<number> {
    return this.totalCostObs.asObservable();
  }

}
