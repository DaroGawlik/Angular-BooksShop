import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'BooksShop-Project-Angular';

  isAsideOpen = true;

  openAside() {
    this.isAsideOpen = true;
  }
}
