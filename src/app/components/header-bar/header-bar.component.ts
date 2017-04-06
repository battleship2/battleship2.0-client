import { Component } from '@angular/core';

@Component({
  selector: 'bsc-header-bar',
  styleUrls: [ 'header-bar.component.scss' ],
  templateUrl: 'header-bar.component.html'
})
export class HeaderBarComponent {
  constructor() {
    console.error('Implement logic in this component to show/hide user menu depending on user state (cf. AuthService).');
  }
}
