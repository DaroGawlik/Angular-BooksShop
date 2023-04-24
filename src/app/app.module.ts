import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './Body/header/header.component';
import { MainComponent } from './Body/main/main.component';
import { AsideComponent } from './Body/aside/aside.component';
import { FooterComponent } from './Body/footer/footer.component';
import { DropupDirective } from './shared/dropupMoreInfo.directive';
import { BookitemComponent } from './Body/main/bookitem/bookitem.component';
import { BooksService } from './service/books.service';
import { BookInBagComponent } from './Body/aside/book-in-bag/book-in-bag.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainComponent,
    AsideComponent,
    FooterComponent,
    DropupDirective,
    BookitemComponent,
    AsideComponent,
    BookInBagComponent,
  ],
  imports: [BrowserModule, NgbModule],
  providers: [BooksService],
  bootstrap: [AppComponent],
})
export class AppModule {}
