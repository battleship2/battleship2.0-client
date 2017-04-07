import { Injectable } from '@angular/core';
import { MdIconRegistry } from '@angular/material';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface SVGIcon {
  name: string;
  path: string;
}

@Injectable()
export class IconRegistryService {
  private _icons: Array<SVGIcon> = [
    { name: 'person_pin_svg', path: 'assets/img/icons/icon-person_pin.svg' }
  ];

  constructor(private _mdIconRegistry: MdIconRegistry, private _domSanitizer: DomSanitizer) {
  }

  public register(icon: SVGIcon): void {
    this._mdIconRegistry.addSvgIcon(icon.name, this._domSanitizer.bypassSecurityTrustResourceUrl(icon.path));
  }

  public startRegistration(): void {
    this._icons.forEach((icon: SVGIcon) => this.register(icon));
  }
}
