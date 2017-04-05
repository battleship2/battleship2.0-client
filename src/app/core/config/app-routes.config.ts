import { Routes } from '@angular/router';
import { PageNotFoundComponent } from '../../components/page-not-found/page-not-found.component';
import { GettingStartedComponent } from '../../components/getting-started/getting-started.component';
import { PickYourBattleComponent } from "../../components/pick-your-battle/pick-your-battle.component";

export const AppRoutes: Routes = [
  {
    path: 'getting-started',
    component: GettingStartedComponent
  },

  {
    path: 'pick-your-battle',
    component: PickYourBattleComponent
  },

  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/pick-your-battle'
  },

  {
    path: '**',
    component: PageNotFoundComponent
  }
];
