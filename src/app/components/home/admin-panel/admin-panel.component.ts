import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountsService } from '../../../core/services/accounts.service';
import { Subscription } from 'rxjs';
import { Account } from '../../../core/models/account';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  accountsSub!: Subscription;
  currentPageSub!: Subscription;

  accounts!: Account[];
  page: number = 1;
  totalPages: number | undefined;
  pages: number[] | undefined;
  currentPage: number = 0;

  constructor(
    private accountsService: AccountsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Activated route, get the params
    this.currentPageSub = this.activatedRoute.queryParams.subscribe(
      (params: Params) => {
        this.currentPage = params['page'];

        this.accountsSub = this.accountsService
          .getAccounts(this.currentPage)
          .subscribe((responseData) => {
            this.accounts = responseData.accounts;
            this.accountsService.accounts = responseData.accounts;
            this.totalPages = responseData.totalPages;
            this.pages = Array(this.totalPages)
              .fill(0)
              .map((x, i) => i);
          });
      }
    );
  }

  ngOnDestroy(): void {
    this.currentPageSub.unsubscribe();
    this.accountsSub.unsubscribe();
  }
}
