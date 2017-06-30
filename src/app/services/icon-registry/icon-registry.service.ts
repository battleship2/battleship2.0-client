import { Injectable } from "@angular/core";
import { MdIconRegistry } from "@angular/material";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

export interface SVGIcon {
  name: string;
  path: string;
}

@Injectable()
export class IconRegistryService {
  private _icons: Array<SVGIcon> = [
    { name: "build_svg", path: "assets/img/icons/icon-build.svg" },
    { name: "check_svg", path: "assets/img/icons/icon-check.svg" },
    { name: "explore_svg", path: "assets/img/icons/icon-explore.svg" },
    { name: "history_svg", path: "assets/img/icons/icon-history.svg" },
    { name: "favorite_svg", path: "assets/img/icons/icon-favorite.svg" },
    { name: "settings_svg", path: "assets/img/icons/icon-settings.svg" },
    { name: "check_box_svg", path: "assets/img/icons/icon-check_box.svg" },
    { name: "extension_svg", path: "assets/img/icons/icon-extension.svg" },
    { name: "person_pin_svg", path: "assets/img/icons/icon-person_pin.svg" },
    { name: "help_outline_svg", path: "assets/img/icons/icon-help_outline.svg" },
    { name: "perm_identity_svg", path: "assets/img/icons/icon-perm_identity.svg" },
    { name: "compare_arrows_svg", path: "assets/img/icons/icon-compare_arrows.svg" },
    { name: "power_settings_new_svg", path: "assets/img/icons/icon-power_settings_new.svg" },
    { name: "check_box_outline_blank_svg", path: "assets/img/icons/icon-check_box_outline_blank.svg" }
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
