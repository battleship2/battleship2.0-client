import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRoutes } from './config/app-routes.config';

@NgModule({
  imports: [ RouterModule.forRoot(AppRoutes, { useHash: true }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
}
