import { Component } from "@angular/core";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "bsc-getting-started",
  styleUrls: [ "getting-started.component.scss" ],
  templateUrl: "getting-started.component.html"
})
export class GettingStartedComponent {
  constructor(private _auth: AuthService) {}

  public fbLogin(): void {
    this._auth.logInWithFacebook();
  }

  public anLogin(): void {
    this._auth.logInAnonymously();
  }

  public login(): void {
    this._auth.logIn({ email: "adrael_boy@live.fr", password: "tototo" });
  }

  public signUp(): void {
    this._auth.signUp({ email: "adrael_boy@live.fr", password: "tototo" })
      .then(user => console.log(user))
      .catch(error => console.log(error));
  }

  public signOut(): void {
    this._auth.signOut();
  }
}
