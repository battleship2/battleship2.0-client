import { DomSanitizer } from "@angular/platform-browser";
import { MdIconRegistry } from "@angular/material";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { AppReadyEventService } from "../../services/app-ready-event.service";
import { AuthService } from "../../services/auth.service";
import { IconRegistryService } from "../../services/icon-registry/icon-registry.service";
import { isNull } from "../../core/utils/utils";
import { Subscription } from "rxjs/Subscription";
import { UserInfo } from "firebase/app";
import { SubscriptionCleanerService } from "../../services/subscription-cleaner.service";
import { environment } from "../../../environments/environment";
import { EngineService } from "../../services/engine.service";

@Component({
  selector: 'bsc-app',
  styleUrls: [ 'app.component.scss' ],
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit, OnDestroy  {
  private _userStatusChanges$: Subscription;

  constructor(
    private _auth: AuthService,
    private _engine: EngineService,
    private _domSanitizer: DomSanitizer,
    private _iconRegistry: IconRegistryService,
    private _appReadyEvent: AppReadyEventService,
    private _mdIconRegistry: MdIconRegistry) {}

  public ngOnInit(): void {
    this._engine.start(environment.serverUrl);

    this._userStatusChanges$ =
      this._auth.userStatusChanges.subscribe((userData: UserInfo) => {
        if (isNull(userData)) {
          this._auth.logInAnonymously();
        }
      });

    this._iconRegistry.startRegistration();

    // Now that the core data has loaded, let's trigger the event that the
    // pre-bootstrap loading screen is listening for. This will initiate
    // the teardown of the loading screen.
    this._appReadyEvent.trigger();
  }

  public ngOnDestroy(): void {
    SubscriptionCleanerService.handleOne(this._userStatusChanges$);
  }
}
