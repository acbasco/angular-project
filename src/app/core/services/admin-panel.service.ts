import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AdminPanelService {
  private _page: number = 1;
  get page(): number {
    return this._page;
  }

  set page(value: number) {
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
    return this._order;
  }

  set order(value: number) {
    this._order = value;
  }

  constructor() {}
}
