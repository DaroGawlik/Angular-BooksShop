import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-bookinbag',
  templateUrl: './bookinbag.component.html',
  styleUrls: ['./bookinbag.component.scss'],
})
export class BookinbagComponent implements OnInit {
  @Input() bookItem: any;

  constructor() {}

  ngOnInit(): void {}
}
