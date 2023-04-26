import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import BooksJson from '../../books.json';
import { BookModel } from '../shared/book.model';

@Injectable()
export class BooksService {
  private defaultBooks: BookModel[] = [];
  private bagOfBooks: Array<BookModel> = [];
  private totalCost: number;
  private bagOfBooksObs = new BehaviorSubject<BookModel[]>(this.bagOfBooks);

  constructor() {
    this.defaultBooks = BooksJson;
    this.bagOfBooksObs.next(this.bagOfBooks);
  }

  addTobagList(book: BookModel) {
    this.bagOfBooks.push(book);
    this.bagOfBooksObs.next(this.bagOfBooks);
  }

  getDefaultBooks() {
    return this.defaultBooks.slice();
  }

  getBagOfBooksObs(): Observable<Array<BookModel>> {
    return this.bagOfBooksObs.asObservable();
  }

  getTotalCosts() {
    this.bagOfBooks.forEach((x) => console.log(x));
    return this.totalCost;
  }
}
