import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './Body/header/header.component';
import { MainComponent } from './Body/main/main.component';
import { AsideComponent } from './Body/aside/aside.component';
import { FooterComponent } from './Body/footer/footer.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent, MainComponent, AsideComponent, FooterComponent],
  imports: [BrowserModule, NgbModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
