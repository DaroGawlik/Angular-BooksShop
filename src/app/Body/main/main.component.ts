import { Component, OnInit } from '@angular/core';
import books from '../../../books.json';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  booksList: {
    author: string;
    imageLink: string;
    title: string;
    price: number;
    description: string;
  }[] = books;

  IsMoreInfoPopUpOpen = false;

  constructor() {}

  ngOnInit(): void {}

}
