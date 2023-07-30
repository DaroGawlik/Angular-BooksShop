import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// CALENDAR
// import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './Body/header/header.component';
import { FooterComponent } from './Body/footer/footer.component';
import { CheckWidthPageDirective } from './shared/checkWidthpage.directive';
import { BooksService } from './service/books.service';
import { SalesWindowComponent } from './Body/sales-window/sales-window.component';
import { AppRoutingModule } from './app-routing.module';
import { MainComponent } from './Body/sales-window/main/main.component';
import { BookitemComponent } from './Body/sales-window/main/bookitem/bookitem.component';
import { AsideComponent } from './Body/sales-window/aside/aside.component';
import { BookinbagComponent } from './Body/sales-window/aside/bookinbag/bookinbag.component';
import { OrderFieldsComponent } from './Body/order-fields/order-fields.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { OrderFieldsBookInBagComponent } from './Body/order-fields/order-fields-book-in-bag/order-fields-book-in-bag.component';
import { AuthInterceptorService } from './auth/auth.interceptor.service';
// import { LoggingInterceptorService } from './auth/logging-interceptor.service';
import { LoginPanelComponent } from './Body/login-panel/login-panel.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { AccountPanelComponent } from './Body/sales-window/aside/account-panel/account-panel.component';
import { UserPanelComponent } from './Body/user-panel/user-panel.component';
import { PanelGetOrdersComponent } from './Body/user-panel/panel-get-orders/panel-get-orders.component';
import { AccountSettingsService } from './service/account-settings.service';
import { StoreModule } from '@ngrx/store';
import { counterRedcuer } from './store/example.reducer';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SalesWindowComponent,
    MainComponent,
    BookitemComponent,
    AsideComponent,
    BookinbagComponent,
    CheckWidthPageDirective,
    OrderFieldsComponent,
    OrderFieldsBookInBagComponent,
    LoginPanelComponent,
    LoadingSpinnerComponent,
    AccountPanelComponent,
    UserPanelComponent,
    PanelGetOrdersComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    FormsModule,
    // MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    HttpClientModule,
    StoreModule.forRoot({
      example: counterRedcuer,
      // auth:  authReducer
    }),
  ],
  providers: [
    BooksService,
    MatDatepickerModule,
    MatNativeDateModule,
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: LoggingInterceptorService,
    //   multi: true,
    // },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
