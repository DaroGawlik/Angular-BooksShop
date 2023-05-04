import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
  ],
  imports: [BrowserModule, NgbModule, AppRoutingModule],
  providers: [BooksService],
  bootstrap: [AppComponent],
})
export class AppModule {}
