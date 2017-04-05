/* tslint:disable:no-unused-variable */

import 'hammerjs';
import { MaterialModule } from '@angular/material';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppRoutingModule } from '../../core/app-routing.module';
import { AppReadyEventService } from '../../services/app-ready-event.service';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { GettingStartedComponent } from '../getting-started/getting-started.component';

describe('Component: SgApp', () => {

  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppRoutingModule,
        MaterialModule.forRoot()
      ],
      declarations: [
        AppComponent,
        PageNotFoundComponent,
        GettingStartedComponent,
      ],
      providers: [
        AppReadyEventService
      ]
    });

    return TestBed.compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
      });
  }));

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the app', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
