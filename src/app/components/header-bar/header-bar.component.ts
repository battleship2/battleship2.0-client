import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { FirebaseAuthState } from "angularfire2";
import { Subscription } from "rxjs/Subscription";
import { isNull } from "../../core/utils/utils";

@Component({
  selector: 'bsc-header-bar',
  styleUrls: [ 'header-bar.component.scss' ],
  templateUrl: 'header-bar.component.html'
})
export class HeaderBarComponent implements OnInit, OnDestroy {
  private _userStatusChanges$: Subscription;

  public userData: firebase.UserInfo;
  public isUserAuthenticated = false;

  constructor(private _auth: AuthService) {
    console.error('Implement logic in this component to show/hide user menu depending on user state (cf. AuthService).');
  }

  public ngOnInit(): void {
    this._userStatusChanges$ =
      this._auth.userStatusChanges.subscribe((userData: firebase.UserInfo) => {
        this.userData = userData;
        this.isUserAuthenticated = !isNull(userData);
      });
  }

  public ngOnDestroy(): void {
    if (!this._userStatusChanges$.closed) {
      this._userStatusChanges$.unsubscribe();
    }
  }
}
