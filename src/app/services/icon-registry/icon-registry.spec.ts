/* tslint:disable:no-unused-variable */

import 'hammerjs';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { MdIconModule } from '@angular/material';
import { IconRegistryService } from './icon-registry.service';
import { Component } from '@angular/core';

@Component({ template: `<md-icon [svgIcon]="iconName" [aria-label]="ariaLabel"></md-icon>` })
class IconRegistryServiceTestComponent {
  public iconName = '';
  public ariaLabel: string = null;

  constructor(public irs: IconRegistryService) {
    irs.register({ name: 'arrow_back_svg', path: 'toto' });
  }
}

describe('Component: LbpApp', () => {
  let fixture: ComponentFixture<IconRegistryServiceTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ MdIconModule ],
      declarations: [ IconRegistryServiceTestComponent ],
      providers: [ IconRegistryService ]
    });

    TestBed.compileComponents();

    fixture = TestBed.createComponent(IconRegistryServiceTestComponent);
  });

  it('should load a given SVG icon', () => {
    const testComponent = fixture.componentInstance;
    const mdIconElement = fixture.debugElement.nativeElement.querySelector('md-icon');

    testComponent.iconName = 'arrow_back_svg';
    fixture.detectChanges();

    expect(mdIconElement.getAttribute('aria-label')).toBe('arrow_back_svg');
  });
});
