import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserInfo } from 'firebase/app';
import { emailPattern, passwordPattern, isNull, isString } from '../../core/utils/utils';
import { TooltipService } from '../../services/tooltip.service';
import { EmailPasswordCredentials } from 'angularfire2/auth';

@Component({
  selector: 'bsc-log-in',
  styleUrls: [ 'log-in.component.scss' ],
  templateUrl: 'log-in.component.html'
})
export class LogInComponent implements OnInit {
  public user: EmailPasswordCredentials = {
    email: '',
    password: ''
  };

  public errorLogIn: Error = null;
  public emailPattern = emailPattern;
  public passwordPattern = passwordPattern;

  public submittedBy = {
    github: false,
    google: false,
    twitter: false,
    password: false,
    facebook: false
  };

  constructor(private _auth: AuthService, private _router: Router) {}

  public ngOnInit(): void {
    const user: UserInfo = this._auth.user;

    if (!isNull(user) && !user['anonymous']) {
      this._handleUserLoggedIn();
      return;
    }

    TooltipService.setup();
  }

  public isEmpty(data: string): boolean {
    return (isString(data) && data.trim().length <= 0);
  }

  public logInWithPassword(): void {
    this._handleSignUpRequest('password');

    this._auth
      .logIn(this.user)
      .then(() => this._handleUserLoggedIn())
      .catch((error: Error) => this._handleSignUpError(error, 'password'));
  }

  public logInWithFacebook(): void {
    this._handleSignUpRequest('facebook');

    this._auth
      .logInWithFacebook()
      .then(() => this._handleUserLoggedIn())
      .catch((error: Error) => this._handleSignUpError(error, 'facebook'));
  }

  public logInWithGithub(): void {
    this._handleSignUpRequest('github');

    this._auth
      .logInWithGithub()
      .then(() => this._handleUserLoggedIn())
      .catch((error: Error) => this._handleSignUpError(error, 'github'));
  }

  public logInWithGoogle(): void {
    this._handleSignUpRequest('google');

    this._auth
      .logInWithGoogle()
      .then(() => this._handleUserLoggedIn())
      .catch((error: Error) => this._handleSignUpError(error, 'google'));
  }

  public logInWithTwitter(): void {
    this._handleSignUpRequest('twitter');

    this._auth
      .logInWithTwitter()
      .then(() => this._handleUserLoggedIn())
      .catch((error: Error) => this._handleSignUpError(error, 'twitter'));
  }

  private _handleSignUpRequest(submitter: string): void {
    this.errorLogIn = null;
    this.submittedBy[submitter] = true;
  }

  private _handleSignUpError(error: Error, submitter: string): void {
    this.errorLogIn = error;
    this.submittedBy[submitter] = false;
  }

  private _handleUserLoggedIn(): Promise<boolean> {
    return this._router.navigateByUrl('/pick-your-battle', { replaceUrl: true });
  }
}
