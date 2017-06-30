import { AfterViewInit, Component, Input, OnInit, ViewChild } from "@angular/core";
import { internationalPhoneNumberPattern } from "../../core/utils/utils";
import { AuthService } from "../../services/auth.service";
import { FormHandlerService } from "../../services/form-handler.service";
import { LogInOptionsComponent } from "../log-in-options/log-in-options.component";
import { AuthProviders } from "../../definitions/types";

@Component({
  selector: "bsc-log-in-with-phone-number",
  styleUrls: [ "log-in-with-phone-number.component.scss" ],
  templateUrl: "log-in-with-phone-number.component.html"
})
export class LogInWithPhoneNumberComponent implements OnInit, AfterViewInit {
  @Input()
  public signUp = false;

  public isEmpty = FormHandlerService.isEmpty;
  public submitted = false;
  public errorLogIn: Error = null;
  public phoneNumber: string = "";
  public phonePattern = internationalPhoneNumberPattern;
  public ignoredOptions: Array<string> = [ "PHONE" ];
  public verificationCode = "";
  public phoneNumberLoginCaptcha: firebase.auth.RecaptchaVerifier = null;
  public showConfirmationResultForm = false;

  private _verificationCallback = null;

  @ViewChild(LogInOptionsComponent)
  private _logInOptions: LogInOptionsComponent;

  constructor(private _fh: FormHandlerService) {}

  private _createCaptcha() {
    this.phoneNumberLoginCaptcha = AuthService.getCaptchaVerifierForPhoneNumberLogin("send-code-phone-sign-in-button");
  }

  public ngOnInit(): void {
    this._fh.setup();
  }

  public ngAfterViewInit(): void {
    this._createCaptcha();
  }

  public validateCode(verificationCode: string) {
    this._verificationCallback(verificationCode);
  }

  public reset(): void {
    this.submitted = false;
    this.phoneNumber = "";
  }

  public submit(provider: AuthProviders | string, credentials?: string): void {
    this.submitted = true;
    this.errorLogIn = null;

    this._fh
      .submit(provider, credentials, this.signUp, this.phoneNumberLoginCaptcha)
      .then((confirmationResult) => {
        this.submitted = false;
        this._verificationCallback = confirmationResult;
        this.showConfirmationResultForm = true;
      })
      .catch((error: Error) => {
        this.reset();
        this.errorLogIn = error;
        this._createCaptcha();
      });
  }
}
