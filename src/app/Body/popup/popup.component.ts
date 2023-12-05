import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ErrorHandlerService } from 'src/app/service/errorHandler.service';
import { FetchingService } from 'src/app/service/fetching.service';
import { PopUpService } from 'src/app/service/popup.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupComponent implements OnDestroy {
  isOpen: boolean;
  isFetching: boolean;
  response: string;
  error$: Observable<string | null>;
  private subscriptions: Subscription[] = [];

  constructor(
    private popUp: PopUpService,
    private fetchingService: FetchingService,
    private errorService: ErrorHandlerService
  ) {
    this.subscriptions.push(
      this.popUp.isOpen.subscribe((boolean) => (this.isOpen = boolean)),
      this.popUp.response.subscribe((value) => (this.response = value)),
      this.fetchingService.isFetchingSubject.subscribe(
        (value) => (this.isFetching = value)
      )
    );
    this.error$ = this.errorService.error$;
  }

  closeLogoutPopup() {
    this.popUp.isOpen.next(false);
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
