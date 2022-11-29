import {Injectable} from '@angular/core';
import {Account} from "../models/account";

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  private accounts: Account[] = [];

  constructor() {
  }

  getAccounts(): Account[] {
    return this.accounts.slice();
  }
}
