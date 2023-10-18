import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountSettingsService } from 'src/app/service/account-settings.service';
import { OrdersService } from 'src/app/service/orders.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupComponent implements OnDestroy {
  isLogoutWindowOpen: boolean;
  isAfterOrderWindowOpen: boolean;
  isFetching: boolean;
  error: string;
  orderResponse: string;

  private subscriptions: Subscription[] = [];

  constructor(
    private accountSettingsService: AccountSettingsService,
    private ordersService: OrdersService
  ) {
    this.subscriptions.push(
      this.accountSettingsService.isLogoutWindowPopup.subscribe((value) => (this.isLogoutWindowOpen = value)),
      this.accountSettingsService.isFetchingPublic.subscribe((value) => (this.isFetching = value)),
      this.accountSettingsService.errorPublic.subscribe((value) => (this.error = value)),
      this.ordersService.isAfterOrderWindowPopup.subscribe((value) => (this.isAfterOrderWindowOpen = value)),
      this.ordersService.orderResponse.subscribe((value) => (this.orderResponse = value)),
      this.ordersService.isFetchingPublic.subscribe((value) => (this.isFetching = value)),
      this.ordersService.errorPublic.subscribe((value) => (this.error = value))
    );
  }

  closeLogoutPopup() {
    if (this.isAfterOrderWindowOpen) {
      this.ordersService.isAfterOrderWindowPopup.next(false);
    }
    if (this.isLogoutWindowOpen) {
      this.accountSettingsService.isLogoutWindowPopup.next(false);
    }
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
