import { Injectable, OnInit } from '@angular/core';
import { Account } from '../models/account';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CheckEmailResponse } from '../interfaces/check-email-response';
import { RegisterAccountResponse } from '../interfaces/register-account-response';
import { LoginCredentials } from '../models/login-credentials';
import { AccountsResponse } from '../interfaces/accounts-response';
import { UpdateAccountResponse } from '../interfaces/update-account-response';
import { DeleteAccountResponse } from '../interfaces/delete-account-response';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AccountsService implements OnInit {
  private baseUrl: string = 'https://acbasco.com/angular-api';
  private _account!: Account | null;
  get account(): Account | null {
    this.account = JSON.parse(localStorage.getItem('account')!);
    return this._account;
  }

  set account(value: Account | null) {
    localStorage.setItem('account', JSON.stringify(value));
    this._account = value;
  }

  private _accounts: Account[] = [];
  get accounts(): Account[] {
    this._accounts = JSON.parse(localStorage.getItem('accounts')!);
    return this._accounts;
  }

  set accounts(value: Account[]) {
    localStorage.setItem('accounts', JSON.stringify(value));
    this._accounts = value;
  }

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.account = JSON.parse(localStorage.getItem('account')!);
    this.accounts = JSON.parse(localStorage.getItem('accounts')!);
  }

  checkEmail(email: string): Observable<CheckEmailResponse> {
    const url: string = this.baseUrl + '/check-email.php';
    return this.http.post<CheckEmailResponse>(url, { email: email });
  }

  registerAccount(account: Account): Observable<RegisterAccountResponse> {
    const url: string = this.baseUrl + '/register.php';
    return this.http.post<RegisterAccountResponse>(url, account);
  }

  updateAccount(account: Account): Observable<UpdateAccountResponse> {
    const url: string = this.baseUrl + '/updateAccount.php';
    return this.http.post<UpdateAccountResponse>(url, account);
  }

  deleteAccount(account: Account): Observable<DeleteAccountResponse> {
    const url: string = this.baseUrl + '/deleteAccount.php';
    return this.http.post<DeleteAccountResponse>(url, account);
  }

  resetPassword(emails: object) {
    const url: string = this.baseUrl + '/resetPassword.php';
    return this.http.post(url, emails);
  }

  // loginAccount(
  //   loginCredentials: LoginCredentials
  // ): Observable<LoginAccountResponse> {
  //   const url: string = this.baseUrl + '/login.php';
  //   return this.http.post<LoginAccountResponse>(url, loginCredentials);
  // }
  loginAccount(loginCredentials: LoginCredentials): Observable<any> {
    const url: string = this.baseUrl + '/login.php';
    const body: string = JSON.stringify(loginCredentials);
    return this.http.post(url, body);
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

  getAccounts(
    page: number,
    order: number,
    search?: string
  ): Observable<AccountsResponse> {
    let appendedUrl: string =
      search != null
        ? `/accounts.php?page=${page}&order=${order}&search=${search}`
        : `/accounts.php?page=${page}&order=${order}`;
    const url: string =
      this.baseUrl + appendedUrl;
    return this.http.get<AccountsResponse>(url);
  }

  clear(): void {
    this.account = null;
    this.accounts = [];
  }

  logout(): void {
    // Clear account
    localStorage.clear();
    this.clear();
    this.authService.onLogout();
  }
}
