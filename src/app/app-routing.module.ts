import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalesWindowComponent } from './Body/sales-window/sales-window.component';
import { OrderFieldsComponent } from './Body/order-fields/order-fields.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/sales-window', pathMatch: 'full' },
  { path: 'sales-window', component: SalesWindowComponent },
  { path: 'order-fields', component: OrderFieldsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
