import { Component, OnInit } from '@angular/core';
import { emailPattern } from '../../core/utils/utils';
import { TooltipService } from '../../services/tooltip.service';
import { EmailPasswordCredentials } from 'angularfire2/auth';
import { AuthProviders } from 'angularfire2';
import { FormHandlerService } from '../../services/form-handler.service';

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
  public providerTriggered: AuthProviders = null;

  constructor(private _fh: FormHandlerService) {}

  public isEmpty(data: string): boolean {
    return FormHandlerService.isEmpty(data);
  }

  public ngOnInit(): void {
    this._fh.setup();
    TooltipService.setup();
  }

  public submit(provider: AuthProviders, credentials?: EmailPasswordCredentials, creation?: boolean): void {
    this.errorLogIn = null;
    this.providerTriggered = provider;

    this._fh
      .submit(provider, credentials, creation)
      .then(() => this.providerTriggered = null)
      .catch((error: Error) => {
        this.errorLogIn = error;
        this.providerTriggered = null;
      });
  }
}
