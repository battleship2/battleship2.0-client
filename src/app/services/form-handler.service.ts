import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";
import { emailPattern, isNull, isString, passwordPattern } from "../core/utils/utils";
import { UserInfo } from "firebase/app";
import { EmailPasswordCredentials } from "angularfire2/auth";
import { AuthProviders, FirebaseAuthState } from "angularfire2";

export interface PasswordStats {
  valid: boolean;
  digit: boolean;
  length: boolean;
  symbol: boolean;
  uppercase: boolean;
  lowercase: boolean;
}

export interface UserNameStats {
  length: boolean;
}

export interface EmailStats {
  valid: boolean;
}

@Injectable()
export class FormHandlerService {
  constructor(private _auth: AuthService, private _router: Router) {
  }

  public setup(): void {
    const user: UserInfo = this._auth.user;

    if (!isNull(user) && !user['anonymous']) {
      this._handleUserLoggedIn();
      return;
    }
  }

  public isEmpty(data: string): boolean {
    return (isString(data) && data.trim().length <= 0);
  }

  public submit(provider: AuthProviders, credentials?: EmailPasswordCredentials, creation?: boolean): firebase.Promise<FirebaseAuthState> {
    let promise: firebase.Promise<FirebaseAuthState> = null;

    switch(provider) {
      case AuthProviders.Password:
        if (creation) {
          promise = this._auth.signUp(credentials);
        } else {
          promise = this._auth.logIn(credentials);
        }
        break;
      case AuthProviders.Google:
        promise = this._auth.logInWithGoogle();
        break;
      case AuthProviders.Github:
        promise = this._auth.logInWithGithub();
        break;
      case AuthProviders.Twitter:
        promise = this._auth.logInWithTwitter();
        break;
      case AuthProviders.Facebook:
        promise = this._auth.logInWithFacebook();
        break;
    }

    return promise.then(() => this._handleUserLoggedIn());
  }

  public static getPasswordStats(password: string): PasswordStats {
    return <PasswordStats>{
      valid: passwordPattern.test(password),
      digit: /^(?=.*\d).+$/ig.test(password),
      length: /^.{8,}$/ig.test(password),
      symbol: /^(?=.*(_|[^\w])).+$/ig.test(password),
      uppercase: /^(?=.*[A-Z]).+$/g.test(password),
      lowercase: /^(?=.*[a-z]).+$/g.test(password)
    };
  }

  public static getUserNameStats(userName: string): UserNameStats {
    return <UserNameStats>{
      length: /^.{8,}$/ig.test(userName)
    };
  }

  public static getEmailStats(email: string): EmailStats {
    return <EmailStats>{
      valid: emailPattern.test(email)
    };
  }

  private _handleUserLoggedIn(): Promise<boolean> {
    return this._router.navigateByUrl('/pick-your-battle', { replaceUrl: true });
  }
}
