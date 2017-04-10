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
    { name: 'settings_svg', path: 'assets/img/icons/icon-settings.svg' },
    { name: 'person_pin_svg', path: 'assets/img/icons/icon-person_pin.svg' },
    { name: 'help_outline_svg', path: 'assets/img/icons/icon-help_outline.svg' },
    { name: 'perm_identity_svg', path: 'assets/img/icons/icon-perm_identity.svg' },
    { name: 'power_settings_new_svg', path: 'assets/img/icons/icon-power_settings_new.svg' }
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
