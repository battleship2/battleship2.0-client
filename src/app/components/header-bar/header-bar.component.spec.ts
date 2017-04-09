/* tslint:disable:no-unused-variable */

import "hammerjs";
import { ComponentFixture, inject, TestBed } from "@angular/core/testing";
import { AuthService } from "../../services/auth.service";
import { HeaderBarComponent } from "./header-bar.component";
import { AngularFireModule } from "angularfire2";
import { firebaseConfig } from "../../core/config/firebase.config";
import { MaterialModule } from "@angular/material";
import { LoggerService } from "../../services/logger.service";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";
import { UserInfo } from "firebase/app";
import { IconRegistryService } from "../../services/icon-registry/icon-registry.service";
import { LogInComponent } from "../log-in/log-in.component";
import { SignUpComponent } from "../sign-up/sign-up.component";
import { RankBoardComponent } from "../rank-board/rank-board.component";
import { PickYourBattleComponent } from "../pick-your-battle/pick-your-battle.component";
import { AppRoutingModule } from "../../core/app-routing.module";
import { GettingStartedComponent } from "../getting-started/getting-started.component";
import { PageNotFoundComponent } from "../page-not-found/page-not-found.component";

describe('HeaderBarComponent', () => {
  let fixture: ComponentFixture<HeaderBarComponent>;
  let userData: UserInfo;
  let rankBoardZone: DebugElement;
  let userAccountZone: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        AppRoutingModule,
        AngularFireModule.initializeApp(firebaseConfig)
      ],
      declarations: [
        LogInComponent,
        SignUpComponent,
        HeaderBarComponent,
        RankBoardComponent,
        PageNotFoundComponent,
        GettingStartedComponent,
        PickYourBattleComponent
      ],
      providers: [
        AuthService,
        LoggerService,
        IconRegistryService
      ]
    });

    TestBed.compileComponents();

    fixture = TestBed.createComponent(HeaderBarComponent);
    fixture.detectChanges();

    userData = <UserInfo>{
      email: 'work.rmarques@gmail.com',
      photoURL: null,
      displayName: 'Raphaël MARQUES'
    };
    rankBoardZone = fixture.debugElement.query(By.css('#rank-board-zone'));
    userAccountZone = fixture.debugElement.query(By.css('#user-account-zone'));
  });

  beforeEach(inject([ IconRegistryService ], (irs) => {
    irs.startRegistration();
  }));

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should hide the "Rank Board" link on small screens when user is unauthenticated', () => {
    expect(rankBoardZone.nativeElement.classList).toContain('hidden-xs-down', 'Expected element to be hidden on small screens if user is unauthenticated.');
  });

  it('should show a loader while retrieving user authentication status', () => {
    expect(fixture.componentInstance.isUserAuthenticated).toBe(null, 'Expected user to be unauthenticated on startup.');
    expect(userAccountZone.nativeElement.children.length).toBe(1, 'Expected only one element to be shown in the user zone.');
    expect(userAccountZone.nativeElement.firstElementChild.classList).toContain('loading-spinner', 'Expected element to be the loader.');
  });

  it('should show the connection form when user is unauthenticated', () => {
    fixture.componentInstance.isUserAuthenticated = false;
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(userAccountZone.nativeElement.children.length).toBe(1, 'Expected only one element to be shown in the user zone.');
      expect(userAccountZone.nativeElement.firstElementChild.classList).toContain('connection-form', 'Expected element to be the user connection form.');
    });
  });

  it('should show the user menu link when user is authenticated', () => {
    fixture.componentInstance.userData = <UserInfo>{};
    fixture.componentInstance.isUserAuthenticated = true;
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(userAccountZone.nativeElement.children.length).toBe(1, 'Expected only one element to be shown in the user zone.');
      expect(userAccountZone.nativeElement.firstElementChild.classList).toContain('user-menu', 'Expected element to be the user menu link.');
    });
  });

  it('should show the default avatar when user is authenticated and does not have an avatar', () => {
    fixture.componentInstance.userData = userData;
    fixture.componentInstance.isUserAuthenticated = true;
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(userAccountZone.nativeElement.children.length).toBe(1, 'Expected only one element to be shown in the user zone.');
      expect(userAccountZone.nativeElement.querySelector('md-icon').getAttribute('aria-label')).toBe('person_pin_svg', 'Expected element to be the default user avatar.')
    });
  });

  it('should show the user avatar when user is authenticated and have one', () => {
    userData.photoURL = 'https://scontent.xx.fbcdn.net/v/t1.0-1/p100x100/16299320_10211702963710550_1207413941079745708_n.jpg?oh=8341d560f5f3d7549bfd91cf1d98dca0&oe=595476A1';
    fixture.componentInstance.userData = userData;
    fixture.componentInstance.isUserAuthenticated = true;
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(userAccountZone.nativeElement.children.length).toBe(1, 'Expected only one element to be shown in the user zone.');
      expect(userAccountZone.nativeElement.querySelector('img').getAttribute('src')).toBe(userData.photoURL, 'Expected element to be the user avatar.')
    });
  });
});
