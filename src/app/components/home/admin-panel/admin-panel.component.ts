import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountsService } from '../../../core/services/accounts.service';
import { Subscription } from 'rxjs';
import { Account } from '../../../core/models/account';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AdminPanelService } from '../../../core/services/admin-panel.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormValidatorService } from '../../../core/services/form-validator.service';

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
  paginationPageForm!: FormGroup;

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
            localStorage.setItem('accounts', JSON.stringify(this.accounts));

            this.accountsService.accounts = responseData.accounts;
            this.totalPages = responseData.totalPages;
            this.pages = Array(this.totalPages)
              .fill(0)
              .map((x, i) => i);
          });
      }
    );

    // Form Setup
    this.paginationPageForm = new FormGroup({
      selectedPage: new FormControl(null, [
        Validators.required,
        Validators.min(1),
        Validators.max(this.totalPages!),
      ]),
    });
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

  onCreateAccount(): void {
    this.router.navigate(['/home', 'create-account'], {
      relativeTo: this.activatedRoute,
    });
  }

  checkPage(direction: string): boolean {
    if (direction == 'previous') {
      return this.adminPanelService.page == 1;
    } else {
      return this.adminPanelService.page == this.totalPages;
    }
  }

  getCurrentPage(): number {
    return this.adminPanelService.page;
  }

  onPaginationNavigate(direction: string): void {
    let targetPage: number = 1;

    switch (direction) {
      case 'first': {
        targetPage = 1;
        break;
      }

      case 'previous': {
        targetPage = this.paginationPageForm.get('selectedPage')?.value - 1;
        break;
      }

      case 'next': {
        console.log(`NEXT-CURRENT: ${this.paginationPageForm.get('selectedPage')?.value}`);
        targetPage = this.paginationPageForm.get('selectedPage')?.value + 1;
        console.log(`NEXT-AFTER: ${targetPage}`);
        break;
      }

      case 'last': {
        targetPage = this.totalPages!;
        break;
      }

      case 'jump': {
        targetPage = this.paginationPageForm.get('selectedPage')?.value;
        break;
      }

      default: {
        break;
      }
    }

    console.log(`Target Page: ${targetPage}`);
    this.adminPanelService.page = targetPage;
    this.router.navigate(['/home', 'admin-panel'], {
      relativeTo: this.activatedRoute,
      queryParams: {
        page: this.adminPanelService.page,
        order: this.adminPanelService.order,
      },
      queryParamsHandling: "merge"
    });
  }
}
