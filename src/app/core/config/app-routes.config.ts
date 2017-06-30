import { Routes } from "@angular/router";
import { PageNotFoundComponent } from "../../components/page-not-found/page-not-found.component";
import { GettingStartedComponent } from "../../components/getting-started/getting-started.component";
import { PickYourBattleComponent } from "../../components/pick-your-battle/pick-your-battle.component";
import { RankBoardComponent } from "../../components/rank-board/rank-board.component";
import { SignUpComponent } from "../../components/sign-up/sign-up.component";
import { LogInComponent } from "../../components/log-in/log-in.component";
import { ResetPasswordComponent } from "../../components/reset-password/reset-password.component";
import { LogInWithPhoneNumberComponent } from "../../components/log-in-with-phone-number/log-in-with-phone-number.component";
import { SignUpWithPhoneNumberComponent } from "../../components/sign-up-with-phone-number/sign-up-with-phone-number.component";

export const AppRoutes: Routes = [
  {
    path: "sign-up",
    component: SignUpComponent,
    data: {
      headerTransparent: true,
      headerLeftPartMode: "dark",
      headerRightPartMode: "light"
    }
  },
  {
    path: "sign-up-with-phone-number",
    component: SignUpWithPhoneNumberComponent,
    data: {
      headerTransparent: true,
      headerLeftPartMode: "dark",
      headerRightPartMode: "light"
    }
  },
  {
    path: "log-in",
    component: LogInComponent,
    data: {
      headerTransparent: true,
      headerLeftPartMode: "dark",
      headerRightPartMode: "light"
    }
  },
  {
    path: "log-in-with-phone-number",
    component: LogInWithPhoneNumberComponent,
    data: {
      headerTransparent: true,
      headerLeftPartMode: "dark",
      headerRightPartMode: "light"
    }
  },
  {
    path: "reset-password",
    component: ResetPasswordComponent,
    data: {
      headerTransparent: true,
      headerLeftPartMode: "dark",
      headerRightPartMode: "dark"
    }
  },
  {
    path: "getting-started",
    component: GettingStartedComponent
  },
  {
    path: "rank-board",
    component: RankBoardComponent
  },
  {
    path: "pick-your-battle",
    component: PickYourBattleComponent
  },
  {
    path: "",
    pathMatch: "full",
    redirectTo: "/pick-your-battle"
  },
  {
    path: "**",
    component: PageNotFoundComponent,
    data: {
      headerTransparent: true
    }
  }
];
