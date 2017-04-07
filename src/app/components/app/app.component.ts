import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AppReadyEventService } from '../../services/app-ready-event.service';
import { AuthService } from '../../services/auth.service';
import { IconRegistryService } from '../../services/icon-registry/icon-registry.service';
import { isNull } from '../../core/utils/utils';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'bsc-app',
  styleUrls: [ 'app.component.scss' ],
  templateUrl: 'app.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy  {
  private _userStatusChanges$: Subscription;

  constructor(
    private _auth: AuthService,
    private _domSanitizer: DomSanitizer,
    private _iconRegistry: IconRegistryService,
    private _appReadyEvent: AppReadyEventService,
    private _mdIconRegistry: MdIconRegistry) {}

  public ngOnInit(): void {
    this._userStatusChanges$ =
      this._auth.userStatusChanges.subscribe((userData: firebase.UserInfo) => {
        if (isNull(userData)) {
          this._auth.signInAnonymously();
        }
      });

    this._iconRegistry.startRegistration();

    // Now that the core data has loaded, let's trigger the event that the
    // pre-bootstrap loading screen is listening for. This will initiate
    // the teardown of the loading screen.
    this._appReadyEvent.trigger();
  }

  public ngOnDestroy(): void {
    if (!this._userStatusChanges$.closed) {
      this._userStatusChanges$.unsubscribe();
    }
  }
}
