import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalesWindowComponent } from './Body/sales-window/sales-window.component';
import { OrderFieldsComponent } from './Body/order-fields/order-fields.component';
import { LoginPanelComponent } from './Body/login-panel/login-panel.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/sales-window', pathMatch: 'full' },
  { path: 'sales-window', component: SalesWindowComponent },
  { path: 'order-fields', component: OrderFieldsComponent },
  { path: 'login-panel', component: LoginPanelComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
