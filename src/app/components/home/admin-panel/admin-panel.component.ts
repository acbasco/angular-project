import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountsService } from '../../../core/services/accounts.service';
import { Subscription } from 'rxjs';
import { Account } from '../../../core/models/account';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AdminPanelService } from '../../../core/services/admin-panel.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  accountsSub!: Subscription;
  currentPageSub!: Subscription;

  accounts!: Account[];
  totalPages!: number;
  pages: number[] | undefined;

  // Forms
  searchForm!: FormGroup;
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

        if (params['search'] != undefined) {
          this.adminPanelService.search = params['search'];
        }

        this.accountsSub = this.accountsService
          .getAccounts(
            this.adminPanelService.page,
            this.adminPanelService.order,
            this.adminPanelService.search,
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

        // Pagination Form Setup
        // Placed here to ensure you get valid totalPages
        this.paginationPageForm = new FormGroup({
          selectedPage: new FormControl(this.adminPanelService.page, [
            Validators.required,
            Validators.min(1),
            Validators.max(this.totalPages!),
          ]),
        });
      }
    );

    // Setup search form
    this.searchForm = new FormGroup({
      search: new FormControl(this.adminPanelService.search),
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
        search: this.adminPanelService.search,
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
        targetPage = this.paginationPageForm.get('selectedPage')?.value + 1;
        break;
      }

      case 'last': {
        targetPage = this.totalPages!;
        break;
      }

      case 'jump': {
        targetPage = this.paginationPageForm.get('selectedPage')?.value;
        this.adminPanelService.page = 1;
        this.adminPanelService.order = 1;
        break;
      }

      default: {
        break;
      }
    }

    this.adminPanelService.page = targetPage;
    this.router.navigate(['/home', 'admin-panel'], {
      relativeTo: this.activatedRoute,
      queryParams: {
        page: this.adminPanelService.page,
        order: this.adminPanelService.order,
        search: this.adminPanelService.search,
      },
    });
  }

  onSearchAccount(inputPageEvent: Event): void {
    let input: string = (inputPageEvent.target as HTMLInputElement).value;
    this.adminPanelService.page = 1;
    if(input != '') {
      this.router.navigate(['/home', 'admin-panel'], {
        relativeTo: this.activatedRoute,
        queryParams: {
          page: this.adminPanelService.page,
          order: this.adminPanelService.order,
          search: this.searchForm.get('search')?.value
        },
      })
    } else {
      this.adminPanelService.search = '';
      this.router.navigate(['/home', 'admin-panel'], {
        relativeTo: this.activatedRoute,
        queryParams: {
          page: this.adminPanelService.page,
          order: this.adminPanelService.order,
          search: this.adminPanelService.search,
        },
      });
    }
  }
}
