import { Component, OnInit, Input } from '@angular/core';

import { Order } from 'src/app/shared/order.model';

@Component({
  selector: 'app-panel-get-orders',
  templateUrl: './panel-get-orders.component.html',
  styleUrls: ['./panel-get-orders.component.scss'],
})
export class PanelGetOrdersComponent implements OnInit {
  @Input() userOrder: Order;
  constructor() {}

  ngOnInit(): void {}
}

