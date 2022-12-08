import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountsService } from '../../core/services/accounts.service';
import { Subscription } from 'rxjs';
import { Account } from '../../core/models/account';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  accountsSub!: Subscription;
  accounts!: Account[];
  page: number = 1;
  totalPages: number | undefined;
  pages: number[] | undefined;

  constructor(
    private accountsService: AccountsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.accountsSub = this.accountsService
      .getAccounts(this.page)
      .subscribe((responseData) => {
        this.accounts = responseData.accounts;
        this.totalPages = responseData.totalPages;
        this.pages = Array(this.totalPages)
          .fill(0)
          .map((x, i) => i);
      });
  }

  ngOnDestroy(): void {
    this.accountsSub.unsubscribe();
  }

  onNextPage(current: number) {
    // TODO: Continue here
  }
}
