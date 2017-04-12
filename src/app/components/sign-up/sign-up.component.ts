import { Component, DoCheck, OnInit } from '@angular/core';
import { emailPattern, passwordPattern } from '../../core/utils/utils';
import { EmailPasswordCredentials } from 'angularfire2/auth';
import { TooltipService } from '../../services/tooltip.service';
import { EmailStats, FormHandlerService, PasswordStats, UserNameStats } from '../../services/form-handler.service';
import { AuthProviders } from 'angularfire2';

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

  public providerTriggered: AuthProviders = null;
  public inputCurrentlyFocused = 'NONE';

  public emailStats: EmailStats;
  public userNameStats: UserNameStats;
  public passwordStats: PasswordStats;

  constructor(private _fh: FormHandlerService) {}

  public isEmpty(data: string): boolean {
    return FormHandlerService.isEmpty(data);
  }

  public ngDoCheck(): void {
    this.emailStats = FormHandlerService.getEmailStats(this.user.email);
    this.passwordStats = FormHandlerService.getPasswordStats(this.user.password);
    this.userNameStats = FormHandlerService.getUserNameStats(this.userDisplayName);
  }

  public ngOnInit(): void {
    this._fh.setup();
    TooltipService.setup();
  }

  public submit(provider: AuthProviders, credentials?: EmailPasswordCredentials, creation?: boolean): void {
    this.errorSignUp = null;
    this.providerTriggered = provider;

    this._fh
      .submit(provider, credentials, creation)
      .then(() => this.providerTriggered = null)
      .catch((error: Error) => {
        this.errorSignUp = error;
        this.providerTriggered = null;
      });
  }
}
