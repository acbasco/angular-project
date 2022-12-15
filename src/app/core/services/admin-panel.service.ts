import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AdminPanelService {
  private _page: number = 1;
  get page(): number {
    this._page = Number(localStorage.getItem('page')!);
    return this._page;
  }

  set page(value: number) {
    localStorage.setItem('page', value.toString());
    this._page = value;
  }

  /*
    1: ID - ASC
    2: ID - DESC
    3: Name - ASC
    4: Name - DESC
    5: Email - ASC
    6: Email - DESC
    7: Member Since - ASC
    8: Member Since - DESC
  */
  private _order: number = 1;
  get order(): number {
    this._order = Number(localStorage.getItem('order')!);
    return this._order;
  }

  set order(value: number) {
    localStorage.setItem('order', value.toString());
    this._order = value;
  }

  private _search: string = '';
  get search(): string {
    return this._search;
  }

  set search(value: string) {
    this._search = value;
  }

  constructor() {}
}
