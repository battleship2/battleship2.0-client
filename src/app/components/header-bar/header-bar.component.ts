import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { Subscription } from "rxjs/Subscription";
import { isNull, truncate } from "../../core/utils/utils";
import { UserInfo } from "firebase/app";
import { Event, NavigationEnd, Router } from "@angular/router";
import { SubscriptionCleanerService } from "../../services/subscription-cleaner.service";

@Component({
  selector: 'bsc-header-bar',
  styleUrls: [ 'header-bar.component.scss' ],
  templateUrl: 'header-bar.component.html'
})
export class HeaderBarComponent implements OnInit, OnDestroy {
  private _routeChanges$: Subscription;
  private _userStatusChanges$: Subscription;

  public userData: UserInfo;
  public isLightHeader = false;
  public userMenuVisible = false;
  public isUserAuthenticated = null;
  public isTransluscentHeader = false;

  constructor(private _auth: AuthService, private _router: Router) {
  }

  public ngOnInit(): void {
    this._routeChanges$ =
      this._router.events
        .filter((event: Event) => event instanceof NavigationEnd)
        .subscribe((event: NavigationEnd) => this._handleRouteChange(event));

    this._userStatusChanges$ =
      this._auth.userStatusChanges.subscribe((userData: UserInfo) => this._handleUserStatusChange(userData));
  }

  public ngOnDestroy(): void {
    SubscriptionCleanerService.handleSome([ this._userStatusChanges$, this._routeChanges$ ]);
  }

  public showUserMenu(): void {
    this.userMenuVisible = true;
  }

  public hideUserMenu(): void {
    this.userMenuVisible = false;
  }

  public signOut(): Promise<void> {
    return this._auth.signOut();
  }

  public getMenuTitle(): string {
    return (this.userData && truncate(this.userData.displayName || this.userData.email, 30, '...')) || 'Unknown';
  }

  private _handleRouteChange(event: NavigationEnd): void {
    switch (event.url) {
      case '/reset-password':
        this.isLightHeader = false;
        this.isTransluscentHeader = true;
        break;
      case '/log-in':
      case '/sign-up':
        this.isLightHeader = true;
        this.isTransluscentHeader = false;
        break;
      default:
        this.isLightHeader = false;
        this.isTransluscentHeader = false;
    }
  }

  private _handleUserStatusChange(userData: UserInfo): void {
    // console.log('HeaderBar User changed to:', userData);
    this.userData = userData;
    this.isUserAuthenticated = (isNull(userData) ? null : !userData[ 'anonymous' ]);
  }
}
