import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Data, Event, NavigationEnd, Router, UrlSegment } from "@angular/router";
import { UserInfo } from "firebase/app";
import "rxjs/add/observable/zip";
import "rxjs/add/operator/mergeMap";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { isNull, truncate } from "../../core/utils/utils";
import { AuthService } from "../../services/auth.service";
import { SubscriptionCleanerService } from "../../services/subscription-cleaner.service";

@Component({
  selector: "bsc-header-bar",
  styleUrls: [ "header-bar.component.scss" ],
  templateUrl: "header-bar.component.html"
})
export class HeaderBarComponent implements OnInit, OnDestroy {
  private _routeChanges$: Subscription;
  private _userStatusChanges$: Subscription;

  public userData: UserInfo;
  public leftPartMode = false;
  public rightPartMode = false;
  public userMenuVisible = false;
  public transparentHeader = false;
  public userAuthenticated = null;

  constructor(private _auth: AuthService, private _router: Router, private _activatedRoute: ActivatedRoute) {
  }

  public ngOnInit(): void {
    this._routeChanges$ =
      this._router.events
        .filter((event: Event) => event instanceof NavigationEnd)
        .map(() => this._activatedRoute)
        .map((route: ActivatedRoute) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        })
        .filter((route: ActivatedRoute) => route.outlet === "primary")
        .mergeMap((route: ActivatedRoute) => Observable.zip(route.data, route.url))
        .subscribe((routeData: [ Data, UrlSegment[] ]) => this._handleRouteChange(routeData));

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

  public signOut(): firebase.Promise<void> {
    return this._auth.signOut();
  }

  public getUserName(): string {
    return (this.userData && truncate(this.userData.displayName || this.userData.email, 30, "...")) || "Unknown";
  }

  private _handleRouteChange([ data, url ]: [ Data, UrlSegment[] ]): void {
    this.leftPartMode = data.headerLeftPartMode || "light";
    this.rightPartMode = data.headerRightPartMode || "light";
    this.transparentHeader = data.headerTransparent || false;
  }

  private _handleUserStatusChange(userData: UserInfo): void {
    this.userData = userData;
    this.userAuthenticated = !isNull(userData);
  }
}
