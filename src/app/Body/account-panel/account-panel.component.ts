import { Component, OnInit, Input } from '@angular/core';

import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-account-panel',
  templateUrl: './account-panel.component.html',
  styleUrls: ['./account-panel.component.scss'],
})
export class AccountPanelComponent implements OnInit {
  public innerWidth: any;

  @Input() isBook: boolean;

  isAuthenticated: boolean = false;
  private userSub: Subscription;
  constructor(private authService: AuthService) {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
  }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
  }
}
