import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-panel-get-orders',
  templateUrl: './panel-get-orders.component.html',
  styleUrls: ['./panel-get-orders.component.scss'],
})
export class PanelGetOrdersComponent implements OnInit {
  @Input() userOrder: any;
  constructor() {}

  ngOnInit(): void {}
}
