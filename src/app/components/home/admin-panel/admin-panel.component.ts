import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountsService } from '../../../core/services/accounts.service';
import { Subscription } from 'rxjs';
import { Account } from '../../../core/models/account';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AdminPanelService } from '../../../core/services/admin-panel.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  accountsSub!: Subscription;
  currentPageSub!: Subscription;

  accounts!: Account[];
  totalPages: number | undefined;
  pages: number[] | undefined;

  constructor(
    private accountsService: AccountsService,
    private adminPanelService: AdminPanelService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Activated route, get the params
    this.currentPageSub = this.activatedRoute.queryParams.subscribe(
      (params: Params) => {
        if (params['page'] != undefined) {
          this.adminPanelService.page = params['page'];
        }

        if (params['order'] != undefined) {
          this.adminPanelService.order = params['order'];
        }

        this.accountsSub = this.accountsService
          .getAccounts(
            this.adminPanelService.page,
            this.adminPanelService.order
          )
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

  isIconVisible(order: number): boolean {
    return order != this.adminPanelService.order;
  }

  onSortTable(order: number): void {
    let prevOrder: number = this.adminPanelService.order;
    let newOrder: number;

    if (order == prevOrder) {
      // Toggle
      newOrder = order % 2 == 0 ? --order : ++order;
    } else {
      newOrder = order;
    }

    this.adminPanelService.order = newOrder;
    this.router.navigate(['/home', 'admin-panel'], {
      relativeTo: this.activatedRoute,
      queryParams: {
        page: this.adminPanelService.page,
        order: this.adminPanelService.order,
      },
    });
  }
}
