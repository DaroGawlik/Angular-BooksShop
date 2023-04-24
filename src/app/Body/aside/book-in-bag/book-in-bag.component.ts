import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-book-in-bag-min992',
  templateUrl: './book-in-bag.component.html',
  styleUrls: ['./book-in-bag.component.scss'],
})
export class BookInBagComponent implements OnInit {
  @Input() bookItem: any;
  
  constructor() {}

  ngOnInit(): void {}
}
