import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { AccountSettingsService } from 'src/app/service/account-settings.service';
import { AuthService } from 'src/app/service/auth.service';
import { UserDataModel } from 'src/app/shared/account-user.model';

@Component({
  selector: 'app-account-panel',
  templateUrl: './account-panel.component.html',
  styleUrls: ['./account-panel.component.scss'],
})
export class AccountPanelComponent implements OnInit {
  public innerWidth: any;

  userData: UserDataModel | null;

  @Input() isBook: boolean;

  isAuthenticated: boolean = false;
  private userSub: Subscription;
  constructor(
    private authService: AuthService,
    private router: Router,
    private accountSettingsService: AccountSettingsService
  ) {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
    this.accountSettingsService.userDataPublic.subscribe(
      (userData: UserDataModel | null) => {
        this.userData = userData;
      }
    );
  }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
  }

  redirectToLoginPanel(route: string, source: string) {
    const queryParams = { source: source };
    this.router.navigate([route], { queryParams: queryParams });
  }
}
