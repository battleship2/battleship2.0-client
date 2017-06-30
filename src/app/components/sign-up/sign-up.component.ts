import { Component, DoCheck, OnInit, ViewChild } from "@angular/core";
import { emailPattern, passwordPattern } from "../../core/utils/utils";
import { AuthProviders, EmailPasswordCredentials } from "../../definitions/types";
import { EmailStats, FormHandlerService, PasswordStats, UserNameStats } from "../../services/form-handler.service";
import { LogInOptionsComponent } from "../log-in-options/log-in-options.component";

@Component({
  selector: "bsc-sign-up",
  styleUrls: [ "sign-up.component.scss" ],
  templateUrl: "sign-up.component.html"
})
export class SignUpComponent implements OnInit, DoCheck {
  public isEmpty = FormHandlerService.isEmpty;
  public submitted = false;
  public errorSignUp: Error = null;
  public emailPattern = emailPattern;
  public ignoredOptions: Array<string> = [ "EMAIL" ];
  public userDisplayName = "";
  public passwordPattern = passwordPattern;
  public inputCurrentlyFocused = "NONE";
  public credentials: EmailPasswordCredentials = {
    email: "",
    password: ""
  };

  public emailStats: EmailStats;
  public passwordStats: PasswordStats;
  public userNameStats: UserNameStats;

  @ViewChild(LogInOptionsComponent)
  private _logInOptions: LogInOptionsComponent;

  constructor(private _fh: FormHandlerService) {}

  public reset(): void {
    this.submitted = false;
    this.credentials = {
      email: "",
      password: ""
    };
    this._logInOptions.reset();
  }

  public ngDoCheck(): void {
    this.emailStats = FormHandlerService.getEmailStats(this.credentials.email);
    this.passwordStats = FormHandlerService.getPasswordStats(this.credentials.password);
    this.userNameStats = FormHandlerService.getUserNameStats(this.userDisplayName);
  }

  public ngOnInit(): void {
    this._fh.setup();
  }

  public submit(provider: AuthProviders | string, credentials?: EmailPasswordCredentials): void {
    this.submitted = true;
    this.errorSignUp = null;

    this._fh
      .submit(provider, credentials, true)
      .catch((error: Error) => {
        this.reset();
        this.errorSignUp = error;
      });
  }
}
