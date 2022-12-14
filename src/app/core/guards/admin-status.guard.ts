import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {Account} from "../models/account";

@Injectable({
  providedIn: 'root'
})
export class AdminStatusGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    let account: Account = JSON.parse(localStorage.getItem('account')!);
    if (account == null) {
      return false;
    } else {
      return account.adminStatus == 1;
    }
  }

}
