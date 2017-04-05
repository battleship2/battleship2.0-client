import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { EmailPasswordCredentials } from "angularfire2/auth";
import { AngularFire, AngularFireAuth, AuthMethods, AuthProviders, FirebaseAuthState } from 'angularfire2';
import { isDefined, isNull } from "../core/utils/utils";
import { LoggerService } from "./logger.service";

@Injectable()
export class AuthService implements OnDestroy {
  private _ngAuth$: Subscription;
  private _authState: FirebaseAuthState;

  constructor(private _logger: LoggerService, private _ngAuth: AngularFireAuth) {
    this._ngAuth$ = _ngAuth.subscribe((state: FirebaseAuthState) => {
      this._logger.log('[AuthService] Receiving authentication:', state);
      this._authState = state;
    });
  }

  public get user(): any {
    if (this.authenticated) {
      return this._authState;
    }

    return null;
  }

  public get authenticated(): boolean {
    return isDefined(this._authState) && !isNull(this._authState);
  }

  public signIn(credentials: EmailPasswordCredentials): firebase.Promise<FirebaseAuthState> {
    return this._ngAuth.login(credentials, {
      provider: AuthProviders.Password,
      method: AuthMethods.Password
    });
  }

  public signUp(credentials: EmailPasswordCredentials): firebase.Promise<FirebaseAuthState> {
    return this._ngAuth.createUser(credentials);
  }

  public signInWithFacebook(): firebase.Promise<FirebaseAuthState> {
    return this._ngAuth.login({
      provider: AuthProviders.Facebook,
      method: AuthMethods.Popup
    });
  }

  public signInAnonymously(): firebase.Promise<FirebaseAuthState> {
    return this._ngAuth.login({
      provider: AuthProviders.Anonymous,
      method: AuthMethods.Anonymous
    });
  }

  public signOut(): Promise<void> {
    return this._ngAuth.logout();
  }

  public ngOnDestroy(): void {
    if (!this._ngAuth$.closed) {
      this._ngAuth$.unsubscribe();
    }
  }
}
