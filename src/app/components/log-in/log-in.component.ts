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
    this.errorLogIn = null;

    this._auth
      .logIn(this.user)
      .then(() => this._handleUserLoggedIn())
      .catch((error: Error) => this.errorLogIn = error);
  }

  public logInWithFacebook(): void {
    this.errorLogIn = null;

    this._auth
      .logInWithFacebook()
      .then(() => this._handleUserLoggedIn())
      .catch((error: Error) => this.errorLogIn = error);
  }

  private _handleUserLoggedIn(): Promise<boolean> {
    return this._router.navigateByUrl('/pick-your-battle', { replaceUrl: true });
  }
}
