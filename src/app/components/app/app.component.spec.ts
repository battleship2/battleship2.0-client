/* tslint:disable:no-unused-variable */

import "hammerjs";
import { MaterialModule } from "@angular/material";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AppRoutingModule } from "../../core/app-routing.module";
import { AppReadyEventService } from "../../services/app-ready-event.service";
import { AppComponent } from "./app.component";
import { PageNotFoundComponent } from "../page-not-found/page-not-found.component";
import { GettingStartedComponent } from "../getting-started/getting-started.component";
import { PickYourBattleComponent } from "../pick-your-battle/pick-your-battle.component";
import { firebaseConfig } from "../../core/config/firebase.config";
import { AngularFireModule } from "angularfire2";
import { AuthService } from "../../services/auth.service";
import { LoggerService } from "../../services/logger.service";
import { HeaderBarComponent } from "../header-bar/header-bar.component";
import { IconRegistryService } from "../../services/icon-registry/icon-registry.service";
import { RankBoardComponent } from "../rank-board/rank-board.component";
import { LogInComponent } from "../log-in/log-in.component";
import { SignUpComponent } from "../sign-up/sign-up.component";

describe("AppComponent", () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        AppRoutingModule,
        AngularFireModule.initializeApp(firebaseConfig)
      ],
      declarations: [
        AppComponent,
        LogInComponent,
        SignUpComponent,
        HeaderBarComponent,
        RankBoardComponent,
        PageNotFoundComponent,
        PickYourBattleComponent,
        GettingStartedComponent
      ],
      providers: [
        AuthService,
        LoggerService,
        IconRegistryService,
        AppReadyEventService
      ]
    });

    TestBed.compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("should create the app", () => {
    expect(fixture.componentInstance).toBeTruthy("Expected application to be created.");
  });
});
