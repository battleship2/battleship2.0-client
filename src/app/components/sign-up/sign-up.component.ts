import { Component, DoCheck, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserInfo } from 'firebase/app';
import { emailPattern, isNull, isString, passwordPattern } from '../../core/utils/utils';
import { EmailPasswordCredentials } from 'angularfire2/auth';

@Component({
  selector: 'bsc-sign-up',
  styleUrls: [ 'sign-up.component.scss' ],
  templateUrl: 'sign-up.component.html'
})
export class SignUpComponent implements OnInit, DoCheck {
  public user: EmailPasswordCredentials = {
    email: '',
    password: ''
  };

  public errorSignUp: Error = null;
  public emailPattern = emailPattern;
  public userDisplayName = '';
  public passwordPattern = passwordPattern;
  public inputCurrentlyFocused = 'NONE';

  public emailRules = {
    valid: false
  };

  public userNameRules = {
    length: false
  };

  public passwordRules = {
    valid: false,
    digit: false,
    length: false,
    symbol: false,
    uppercase: false,
    lowercase: false
  };

  constructor(private _auth: AuthService, private _router: Router) {}

  public ngDoCheck(): void {
    this._updateEmailRules();
    this._updatePasswordRules();
    this._updateUsernameRules();
  }

  public ngOnInit(): void {
    const user: UserInfo = this._auth.user;

    if (!isNull(user) && !user['anonymous']) {
      this._handleUserLoggedIn();
      return;
    }
  }

  public isEmpty(data: string): boolean {
    return (isString(data) && data.trim().length <= 0);
  }

  public signUpWithPassword(): void {
    this.errorSignUp = null;

    this._auth
      .signUp(this.user)
      .then(() => this._handleUserLoggedIn())
      .catch((error: Error) => this.errorSignUp = error);
  }

  public signUpWithFacebook(): void {
    this.errorSignUp = null;

    this._auth
      .logInWithFacebook()
      .then(() => this._handleUserLoggedIn())
      .catch((error: Error) => this.errorSignUp = error);
  }

  private _handleUserLoggedIn(): Promise<boolean> {
    return this._router.navigateByUrl('/pick-your-battle', { replaceUrl: true });
  }

  private _updateEmailRules(): void {
    this.emailRules.valid = emailPattern.test(this.user.email);
  }

  private _updatePasswordRules(): void {
    this.passwordRules.valid = passwordPattern.test(this.user.password);
    this.passwordRules.digit = /^(?=.*\d).+$/ig.test(this.user.password);
    this.passwordRules.length = /^.{8,}$/ig.test(this.user.password);
    this.passwordRules.symbol = /^(?=.*(_|[^\w])).+$/ig.test(this.user.password);
    this.passwordRules.uppercase = /^(?=.*[A-Z]).+$/g.test(this.user.password);
    this.passwordRules.lowercase = /^(?=.*[a-z]).+$/g.test(this.user.password);
  }

  private _updateUsernameRules(): void {
    this.userNameRules.length = /^.{8,}$/ig.test(this.userDisplayName);
  }
}
