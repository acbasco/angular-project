import { Injectable } from '@angular/core';
import { Account } from '../models/account';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CheckEmailResponse } from '../interfaces/check-email-response';
import { RegisterAccountResponse } from '../interfaces/register-account-response';
import { LoginCredentials } from '../models/login-credentials';
import { LoginAccountResponse } from '../interfaces/login-account-response';
import {AccountsResponse} from "../interfaces/accounts-response";

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  private baseUrl: string = 'https://acbasco.com/angular-api';
  private _account!: Account | null;
  get account(): Account | null {
    return this._account;
  }

  set account(value: Account | null) {
    this._account = value;
  }

  // private _accounts: Account[] = [];
  // get accounts(): Account[] {
  //   return this._accounts;
  // }
  //
  // set accounts(value: Account[]) {
  //   this._accounts = value;
  // }

  constructor(private http: HttpClient) {}

  checkEmail(email: string): Observable<CheckEmailResponse> {
    const url: string = this.baseUrl + '/check-email.php';
    return this.http.post<CheckEmailResponse>(url, { email: email });
  }

  registerAccount(account: Account): Observable<RegisterAccountResponse> {
    const url: string = this.baseUrl + '/register.php';
    return this.http.post<RegisterAccountResponse>(url, account);
  }

  loginAccount(
    loginCredentials: LoginCredentials
  ): Observable<LoginAccountResponse> {
    const url: string = this.baseUrl + '/login.php';
    return this.http.post<LoginAccountResponse>(url, loginCredentials);
  }

  // getAccounts(): Account[] {
  //   const url: string = this.baseUrl + '/accounts.php';
  //   this.http
  //     .get<Account[]>(url)
  //     .pipe(
  //       map((responseData) => {
  //         console.log(responseData, typeof responseData);
  //         this.accounts = responseData as Account[];
  //       })
  //     )
  //     .subscribe((responseData: unknown) => {
  //       this.accounts = responseData as Account[];
  //     });
  //   return this.accounts;
  // }

  getAccounts(page: number): Observable<AccountsResponse> {
    const url: string = this.baseUrl + `/accounts.php?page=${page}`;
    return this.http.get<AccountsResponse>(url);
  }

  logout(): void {
    this.account = null;
  }
}
