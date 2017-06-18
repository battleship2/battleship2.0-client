import { EventEmitter, Injectable, OnDestroy, Output } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from "firebase/app";
import { UserInfo } from "firebase/app";
import { Subscription } from "rxjs/Subscription";
import { isDefined, isNull } from "../core/utils/utils";
import { BSUserInfo, EmailPasswordCredentials } from "../definitions/types";
import { LoggerService } from "./logger.service";
import { SubscriptionCleanerService } from "./subscription-cleaner.service";

@Injectable()
export class AuthService implements OnDestroy {
  private _user: firebase.User;
  private _user$: Subscription;

  @Output()
  public userStatusChanges: EventEmitter<UserInfo> = new EventEmitter<UserInfo>();

  constructor(private _logger: LoggerService, private _ngFireAuth: AngularFireAuth) {
    this._user$ = _ngFireAuth.authState.subscribe((user: firebase.User) => {
      this._user = user;
      this.userStatusChanges.emit(this.user || null);
    });
  }

  public get user(): BSUserInfo {
    if (this.authenticated && !this._user.isAnonymous) {
      return <BSUserInfo>{
        uid: this._user.uid,
        email: this._user.email,
        photoURL: this._user.photoURL,
        providerId: this._user.providerId,
        displayName: this._user.displayName,
        phoneNumber: this._user.phoneNumber
      };
    }

    return null;
  }

  public get authenticated(): boolean {
    return isDefined(this._user) && !isNull(this._user);
  }

  public signOut(): firebase.Promise<void> {
    return this._ngFireAuth.auth.signOut();
  }

  public signUp(credentials: EmailPasswordCredentials): firebase.Promise<any> {
    return this._ngFireAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password);
  }

  public logIn(credentials: EmailPasswordCredentials): firebase.Promise<any> {
    return this._ngFireAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
  }

  public logInWithFacebook(): firebase.Promise<any> {
    return this._ngFireAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
  }

  public logInWithGithub(): firebase.Promise<any> {
    return this._ngFireAuth.auth.signInWithPopup(new firebase.auth.GithubAuthProvider());
  }

  public logInWithGoogle(): firebase.Promise<any> {
    return this._ngFireAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  public logInWithTwitter(): firebase.Promise<any> {
    return this._ngFireAuth.auth.signInWithPopup(new firebase.auth.TwitterAuthProvider());
  }

  public logInWithPhoneNumber(number: string): firebase.Promise<any> {
    const recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
      'size': 'invisible',
      'callback': function(response) {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // submit sign in
      }
    });

    return this._ngFireAuth.auth.signInWithPhoneNumber('', null)
      .then(function (confirmationResult) {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        // const confirmationResult = confirmationResult;

        // get code from user and submit
        // confirmationResult.confirm(code).then(function (result) {
        //   // User signed in successfully.
        //   var user = result.user;
        //   // ...
        // }).catch(function (error) {
        //   // User couldn't sign in (bad verification code?)
        //   // ...
        // });
      }).catch(function (error) {
        // Error; SMS not sent
        // ...

        // reset the captcha
        recaptchaVerifier.render().then(function(widgetId) {
          // grecaptcha.reset(widgetId);
        });
      });
  }

  public logInAnonymously(): firebase.Promise<any> {
    return this._ngFireAuth.auth.signInAnonymously();
  }

  public ngOnDestroy(): void {
    SubscriptionCleanerService.handleOne(this._user$);
  }
}
