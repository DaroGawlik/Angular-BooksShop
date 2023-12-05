import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';

import { AuthService, AuthResponseData } from '../../service/auth.service';
import { ErrorHandlerService } from 'src/app/service/errorHandler.service';
import { FetchingService } from 'src/app/service/fetching.service';
@Component({
  selector: 'app-login-panel',
  templateUrl: './login-panel.component.html',
  styleUrls: ['./login-panel.component.scss'],
})
export class LoginPanelComponent implements OnInit {
  source: string;

  isLoginMode = true;

  isFetching$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private errorService: ErrorHandlerService,
    private fetchingService: FetchingService
  ) {
    this.error$ = this.errorService.error$;
    this.isFetching$ = this.fetchingService.isFetching$;
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.source = params['source'];
      // Możesz teraz użyć wartości 'source' w dalszej części komponentu
    });
    this.onClearError();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.onClearError();
  }
  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const username = form.value.username;
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signUp(username, email, password);
    }
    this.fetchingService.isFetchingSubject.next(true);
    authObs.subscribe((resData: AuthResponseData) => {
      if (this.source === 'confirmBtn') {
        this.router.navigate(['/order-fields']);
      } else {
        this.router.navigate(['/user-panel']);
      }
    });
  }

  backToMenu() {
    this.router.navigate(['/sales-window']);
  }
  onClearError(): void {
    this.errorService.clearErrorService();
  }
}
