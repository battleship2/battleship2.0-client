import 'hammerjs';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { LoggerService } from '../services/logger.service';
import { AppReadyEventService } from '../services/app-ready-event.service';
import { AppComponent } from '../components/app/app.component';
import { PageNotFoundComponent } from '../components/page-not-found/page-not-found.component';
import { GettingStartedComponent } from '../components/getting-started/getting-started.component';
import { APP_BASE_HREF } from '@angular/common';
import { environment } from '../../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AuthService } from '../services/auth.service';
import { PickYourBattleComponent } from '../components/pick-your-battle/pick-your-battle.component';
import { firebaseConfig } from './config/firebase.config';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    PickYourBattleComponent,
    GettingStartedComponent,
  ],
  bootstrap: [ AppComponent ],
  providers: [
    AuthService,
    LoggerService,
    AppReadyEventService,

    { provide: APP_BASE_HREF, useValue: environment.baseHref }
  ]
})
export class AppModule {
}
