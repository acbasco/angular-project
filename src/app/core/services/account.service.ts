import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, of, tap} from "rxjs";
import {Account} from "../models/account";
import {MessageService} from "./message.service";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
  ) {
  }

  private baseUrl: string = "https://reqres.in/api";
  private urlGetAccounts: string = '/users/page';

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({'Content-Type': 'application/json'}),
  };

  // GET accounts from the server
  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(this.baseUrl);
  }

  // GET account details from the server
  getAccount(id: Number): Observable<Account> {
    const url: string = `${this.baseUrl}/${id}`;
    return this.http.get<Account>(url).pipe(
      tap((_) => this.log(`fetched account id=${id}`)),
      catchError(this.handleError<Account>('getAccount')),
    );
  }

  // Create an account
  addAccount(account: Account): Observable<Account> {
    return this.http.post<Account>(this.baseUrl, account, this.httpOptions).pipe(
      tap((newAccount: Account) => this.log(`added account with id=${account.id}`)),
      catchError(this.handleError<Account>('addAccount')),
    );
  }

  // Update an account
  updateAccount(account: Account): Observable<any> {
    return this.http.put(this.baseUrl, account, this.httpOptions).pipe(
      tap(_ => this.log(`updated account id=${account.id}`)),
      catchError(this.handleError<any>('updateAccount')),
    );
  }

  // Delete an account
  deleteAccount(id: Number): Observable<Account> {
    const url: string = `${this.baseUrl}/${id}`;
    return this.http.delete<Account>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted account with id=${id}`)),
      catchError(this.handleError<Account>('deleteAccount')),
    );
  }

  private log(message: string) {
    this.messageService.add(`AccountService: ${message}`);
  }

  /** Taken from: Angular example
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
