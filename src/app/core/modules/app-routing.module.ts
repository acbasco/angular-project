import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from '../../components/common/page-not-found/page-not-found.component';
import { HomeComponent } from '../../components/home/home.component';
import { AccountDetailsComponent } from '../../components/home/account-details/account-details.component';
import { AdminPanelComponent } from '../../components/home/admin-panel/admin-panel.component';
import { AccountStatusGuard } from '../guards/account-status.guard';
import { LandingPageComponent } from '../../components/landing-page/landing-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing-page',
    pathMatch: 'full',
  },
  {
    path: 'landing-page',
    component: LandingPageComponent,
  },
  { path: 'register', redirectTo: 'landing-page' },
  { path: 'login', redirectTo: 'landing-page' },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AccountStatusGuard],
    children: [
      {
        path: 'admin-panel',
        component: AdminPanelComponent,
      },
      {
        path: 'account-details/:id',
        component: AccountDetailsComponent,
      },
    ],
  },

  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: 'page-not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
