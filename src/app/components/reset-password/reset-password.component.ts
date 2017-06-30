import { Component } from "@angular/core";
import { emailPattern } from "../../core/utils/utils";
import { FormHandlerService } from "../../services/form-handler.service";

@Component({
  selector: "bsc-reset-password",
  styleUrls: [ "reset-password.component.scss" ],
  templateUrl: "reset-password.component.html"
})
export class ResetPasswordComponent {
  public email = "";
  public emailSent = false;
  public emailSending = false;
  public emailPattern = emailPattern;

  public isEmpty(data: string): boolean {
    return FormHandlerService.isEmpty(data);
  }

  public sendRecoveryEmail(email: string): void {
    console.error("IMPLEMENT RECOVERY EMAIL LOGIC HERE");

    this.emailSending = true;

    setTimeout(() => {
      this.emailSending = false;
      this.emailSent = true;
    }, 2000);
  }
}
