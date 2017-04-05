import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppReadyEventService } from '../../services/app-ready-event.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'bs-app',
  styleUrls: [ 'app.component.scss' ],
  templateUrl: 'app.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  constructor(
    private _auth: AuthService,
    private _domSanitizer: DomSanitizer,
    private _appReadyEvent: AppReadyEventService,
    private _mdIconRegistry: MdIconRegistry) {}

  public ngOnInit(): void {
    // Registering icons used throughout the app
    const icons = [
      { name: 'build_svg', path: 'assets/img/icons/icon-build.svg' },
      { name: 'brush_svg', path: 'assets/img/icons/icon-brush.svg' },
      { name: 'memory_svg', path: 'assets/img/icons/icon-memory.svg' },
      { name: 'grid_on_svg', path: 'assets/img/icons/icon-grid_on.svg' },
      { name: 'folder_open_svg', path: 'assets/img/icons/icon-folder_open.svg' }
    ];

    icons.forEach(icon => {
      this._mdIconRegistry.addSvgIcon(icon.name, this._domSanitizer.bypassSecurityTrustResourceUrl(icon.path));
    });

    // Now that the core data has loaded, let's trigger the event that the
    // pre-bootstrap loading screen is listening for. This will initiate
    // the teardown of the loading screen.
    this._appReadyEvent.trigger();
  }
}
