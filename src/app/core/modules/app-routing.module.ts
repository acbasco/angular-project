import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from '../../components/common/page-not-found/page-not-found.component';
import { HomeComponent } from '../../components/home/home.component';
import { AccountDetailsComponent } from '../../components/account-details/account-details.component';
import { AdminPanelComponent } from '../../components/admin-panel/admin-panel.component';
import { AccountStatusGuard } from '../guards/account-status.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  { path: 'register', redirectTo: '' },
  { path: 'login', redirectTo: '' },
  {
    path: 'account-details',
    component: AccountDetailsComponent,
    canActivate: [AccountStatusGuard],
  },
  {
    path: 'admin-panel',
    component: AdminPanelComponent,
    canActivate: [AccountStatusGuard],
    children: [
      {path: 'admin-panel/page', }
    ]
  },
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: 'page-not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
