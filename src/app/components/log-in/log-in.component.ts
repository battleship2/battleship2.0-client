import { Component, OnInit, ViewChild } from "@angular/core";
import { emailPattern } from "../../core/utils/utils";
import { AuthProviders, EmailPasswordCredentials } from "../../definitions/types";
import { FormHandlerService } from "../../services/form-handler.service";
import { LogInOptionsComponent } from "../log-in-options/log-in-options.component";

@Component({
  selector: "bsc-log-in",
  styleUrls: [ "log-in.component.scss" ],
  templateUrl: "log-in.component.html"
})
export class LogInComponent implements OnInit {
  public isEmpty = FormHandlerService.isEmpty;
  public submitted = false;
  public errorLogIn: Error = null;
  public emailPattern = emailPattern;
  public ignoredOptions: Array<string> = [ "EMAIL" ];
  public credentials: EmailPasswordCredentials = {
    email: "",
    password: ""
  };

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

  public ngOnInit(): void {
    this._fh.setup();
  }

  public submit(provider: AuthProviders | string, credentials?: EmailPasswordCredentials): void {
    this.submitted = true;
    this.errorLogIn = null;

    this._fh
      .submit(provider, credentials)
      .catch((error: Error) => {
        this.reset();
        this.errorLogIn = error;
      });
  }
}
