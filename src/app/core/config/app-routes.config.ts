import { Routes } from '@angular/router';
import { PageNotFoundComponent } from '../../components/page-not-found/page-not-found.component';
import { GettingStartedComponent } from '../../components/getting-started/getting-started.component';
import { PickYourBattleComponent } from "../../components/pick-your-battle/pick-your-battle.component";
import { RankBoardComponent } from "../../components/rank-board/rank-board.component";
import { SignUpComponent } from "../../components/sign-up/sign-up.component";
import { SignInComponent } from "../../components/sign-in/sign-in.component";

export const AppRoutes: Routes = [
  {
    path: 'sign-up',
    component: SignUpComponent
  },

  {
    path: 'sign-in',
    component: SignInComponent
  },

  {
    path: 'getting-started',
    component: GettingStartedComponent
  },

  {
    path: 'rank-board',
    component: RankBoardComponent
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
