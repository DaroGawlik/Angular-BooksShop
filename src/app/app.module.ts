import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
  ],
  providers: [BooksService, MatDatepickerModule, MatNativeDateModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
