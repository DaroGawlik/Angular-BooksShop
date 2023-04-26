import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './Body/header/header.component';
import { MainComponent } from './Body/main/main.component';
import { AsideComponent } from './Body/aside/aside.component';
import { FooterComponent } from './Body/footer/footer.component';
import { CheckWidthPageDirective } from './shared/checkWidthpage.directive';
import { BookitemComponent } from './Body/main/bookitem/bookitem.component';
import { BooksService } from './service/books.service';
import { BookinbagComponent } from './Body/aside/bookinbag/bookinbag.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainComponent,
    AsideComponent,
    FooterComponent,
    CheckWidthPageDirective,
    BookitemComponent,
    AsideComponent,
    BookinbagComponent,
  ],
  imports: [BrowserModule, NgbModule],
  providers: [BooksService],
  bootstrap: [AppComponent],
})
export class AppModule {}
