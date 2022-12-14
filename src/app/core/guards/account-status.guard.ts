import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { AccountsService } from '../services/accounts.service';
import { Account } from '../models/account';

@Injectable({
  providedIn: 'root',
})
export class AccountStatusGuard implements CanActivate {
  constructor() {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let account: Account = JSON.parse(localStorage.getItem('account')!);
    if (account == null) {
      return false;
    } else {
      return account.accountStatus == 1;
    }
  }
}
