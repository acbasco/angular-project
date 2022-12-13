import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { AccountsService } from '../services/accounts.service';

@Injectable({
  providedIn: 'root',
})
export class AccountStatusGuard implements CanActivate {
  constructor(public accountsService: AccountsService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.accountsService.account != null;
  }
}
