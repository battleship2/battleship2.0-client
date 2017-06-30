import { APP_BASE_HREF } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { MaterialModule } from "@angular/material";
import { BrowserModule } from "@angular/platform-browser";
import { AngularFireModule } from "angularfire2";
import { AngularFireAuthModule } from "angularfire2/auth";
import "hammerjs";
import { environment } from "../../environments/environment";
import { AppComponent } from "../components/app/app.component";
import { ChatComponent } from "../components/chat/chat.component";
import { GettingStartedComponent } from "../components/getting-started/getting-started.component";
import { HeaderBarComponent } from "../components/header-bar/header-bar.component";
import { LogInComponent } from "../components/log-in/log-in.component";
import { PageNotFoundComponent } from "../components/page-not-found/page-not-found.component";
import { PickYourBattleComponent } from "../components/pick-your-battle/pick-your-battle.component";
import { RankBoardComponent } from "../components/rank-board/rank-board.component";
import { ResetPasswordComponent } from "../components/reset-password/reset-password.component";
import { SignUpComponent } from "../components/sign-up/sign-up.component";
import { AppReadyEventService } from "../services/app-ready-event.service";
import { AuthService } from "../services/auth.service";
import { EngineService } from "../services/engine.service";
import { FormHandlerService } from "../services/form-handler.service";
import { IconRegistryService } from "../services/icon-registry/icon-registry.service";
import { LoggerService } from "../services/logger.service";
import { SocketService } from "../services/socket.service";
import { SubscriptionCleanerService } from "../services/subscription-cleaner.service";
import { TooltipService } from "../services/tooltip.service";
import { AppRoutingModule } from "./app-routing.module";
import { firebaseConfig } from "./config/firebase.config";
import { LogInOptionsComponent } from "../components/log-in-options/log-in-options.component";
import { LogInWithPhoneNumberComponent } from "../components/log-in-with-phone-number/log-in-with-phone-number.component";
import { GameMottoComponent } from "../components/game-motto/game-motto.component";
import { IconCheckboxComponent } from "../components/icon-checkbox/icon-checkbox.component";
import { SignUpWithPhoneNumberComponent } from "../components/sign-up-with-phone-number/sign-up-with-phone-number.component";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule
  ],
  declarations: [
    AppComponent,
    ChatComponent,
    LogInComponent,
    SignUpComponent,
    GameMottoComponent,
    RankBoardComponent,
    HeaderBarComponent,
    IconCheckboxComponent,
    LogInOptionsComponent,
    PageNotFoundComponent,
    ResetPasswordComponent,
    PickYourBattleComponent,
    GettingStartedComponent,
    LogInWithPhoneNumberComponent,
    SignUpWithPhoneNumberComponent
  ],
  bootstrap: [ AppComponent ],
  providers: [
    AuthService,
    EngineService,
    LoggerService,
    SocketService,
    TooltipService,
    FormHandlerService,
    IconRegistryService,
    AppReadyEventService,
    SubscriptionCleanerService,

    { provide: APP_BASE_HREF, useValue: environment.baseHref }
  ]
})
export class AppModule {
}
