import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'BooksShop-Project-Angular';

  isAsideOpen = false;

  openAside() {
    this.isAsideOpen = true;
  }
}
