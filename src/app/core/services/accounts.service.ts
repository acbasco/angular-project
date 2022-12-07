import { Injectable } from '@angular/core';
import { Account } from '../models/account';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  private url: string =
    'https://angular-project-74899-default-rtdb.asia-southeast1.firebasedatabase.app/accounts.json';
  // reqres
  // private url: string = 'https://reqres.in/api/users';

  private accounts: Account[] = [];

  constructor(private http: HttpClient) {}

  getAccounts(): Account[] {
    return this.accounts.slice();
  }

  createAccount(account: Account) {
    this.http.post(this.url, account).subscribe((responseData) => {
      console.log(responseData);
    });
  }

  // fs
}
