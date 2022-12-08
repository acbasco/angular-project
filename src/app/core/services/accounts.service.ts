import { Injectable } from '@angular/core';
import { Account } from '../models/account';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CheckEmailResponse } from '../interfaces/check-email-response';
import { RegisterAccountResponse } from '../interfaces/register-account-response';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  // private url: string =
  //   'https://angular-project-74899-default-rtdb.asia-southeast1.firebasedatabase.app/accounts.json';
  private baseUrl: string = 'https://acbasco.com/angular-api';

  private _accounts: Account[] = [];
  get accounts(): Account[] {
    return this._accounts;
  }

  constructor(private http: HttpClient) {}

  checkEmail(email: string): Observable<CheckEmailResponse> {
    const url: string = this.baseUrl + '/check-email.php';
    return this.http.post<CheckEmailResponse>(url, { email: email });
  }

  createAccount(account: Account): Observable<RegisterAccountResponse> {
    const url: string = this.baseUrl + '/register.php';
    return this.http.post<RegisterAccountResponse>(url, account);
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

  getAccounts(): Observable<Account[]> {
    const url: string = this.baseUrl + '/accounts.php';
    return this.http.get<Account[]>(url);
  }
}
