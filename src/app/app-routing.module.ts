import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalesWindowComponent } from './Body/sales-window/sales-window.component';
import { OrderFieldsComponent } from './Body/order-fields/order-fields.component';
import { LoginPanelComponent } from './Body/login-panel/login-panel.component';
import { AuthGuard } from './service/auth.guard';
import { UserPanelComponent } from './Body/user-panel/user-panel.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/sales-window', pathMatch: 'full' },
  {
    path: '/sales-window',
    component: SalesWindowComponent,
  },
  {
    path: '/order-fields',
    component: OrderFieldsComponent,
    canActivate: [AuthGuard],
  },
  { path: '/login-panel', component: LoginPanelComponent },
  { path: '/user-panel', component: UserPanelComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
