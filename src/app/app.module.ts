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

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainComponent,
    AsideComponent,
    FooterComponent,
    DropupDirective,
    BookitemComponent,
  ],
  imports: [BrowserModule, NgbModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
