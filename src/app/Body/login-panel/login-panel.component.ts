import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

import { AuthService, AuthResponseData } from '../../service/auth.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { BooksService } from 'src/app/service/books.service';
import { BookModel } from 'src/app/shared/book.model';

@Component({
  selector: 'app-login-panel',
  templateUrl: './login-panel.component.html',
  styleUrls: ['./login-panel.component.scss'],
})
export class LoginPanelComponent implements OnInit {
  bagOfBooksArr: boolean;
  isLoginMode = true;
  isLoading = false;
  source: string;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private booksService: BooksService
  ) {
    this.booksService
      .getBagOfBooksObs()
      .subscribe((booksInBag: BookModel[]) => {
        this.bagOfBooksArr = booksInBag.length > 0 ? true : false;
      });
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.source = params['source'];
      // Możesz teraz użyć wartości 'source' w dalszej części komponentu
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;
    this.isLoading = true;

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe(
      (resData) => {
        // console.log(resData);
        this.isLoading = false;
        if (this.source == 'confirmBtn') {
          this.router.navigate(['/order-fields']);
        } else {
          this.router.navigate(['/user-panel']);
        }
      },
      (errorMessage) => {
        // console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      }
    );
  }
}
