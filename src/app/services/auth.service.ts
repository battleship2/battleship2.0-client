import { EventEmitter, Injectable, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { EmailPasswordCredentials } from "angularfire2/auth";
import { AngularFire, AngularFireAuth, AuthMethods, AuthProviders, FirebaseAuthState } from 'angularfire2';
import { isDefined, isNull, merge } from "../core/utils/utils";
import { LoggerService } from "./logger.service";
import { UserInfo } from "firebase/app";

@Injectable()
export class AuthService implements OnDestroy {
  private _ngAuth$: Subscription;
  private _authState: FirebaseAuthState;

  @Output()
  public userStatusChanges: EventEmitter<UserInfo> = new EventEmitter<UserInfo>();

  constructor(private _logger: LoggerService, private _ngAuth: AngularFireAuth) {
    this._ngAuth$ = _ngAuth.subscribe((state: FirebaseAuthState) => {
      this._logger.log('[AuthService] Receiving authentication:', state);
      this._authState = state;
      this.userStatusChanges.emit(this.user);
    });
  }

  public get user(): UserInfo {
    if (this.authenticated) {
      switch (this._authState.provider) {
        case 2:
          return <UserInfo>merge(this._authState.facebook, {
            anonymous: (this._authState.anonymous === true)
          });
        default:
          return <UserInfo>{
            uid: this._authState.auth.uid,
            email: this._authState.auth.email,
            photoURL: this._authState.auth.photoURL,
            anonymous: (this._authState.anonymous === true),
            providerId: this._authState.auth.providerId,
            displayName: this._authState.auth.displayName
          };
      }
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
