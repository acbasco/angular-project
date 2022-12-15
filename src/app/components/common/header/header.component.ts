import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsService } from '../../../core/services/accounts.service';
import { ToastrService } from 'ngx-toastr';
import { AdminPanelService } from '../../../core/services/admin-panel.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  page!: number;
  isHamburgerVisible: boolean = false;

  constructor(
    private accountsService: AccountsService,
    private adminPanelService: AdminPanelService,
    private toastService: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.page = this.adminPanelService.page;
  }

  isActive(page: string): boolean {
    return this.router.url.includes(page);
  }

  onNavigateToAdminPanel(): void {
    this.router
      .navigate(['/home', 'admin-panel'], {
        relativeTo: this.activatedRoute,
        queryParams: {
          page: this.adminPanelService.page,
          order: this.adminPanelService.order,
        },
      })
      .then();
  }

  onViewAccount(): void {
    const id: string = this.accountsService.account?.id!;

    this.router
      .navigate(['/home', 'account-details', id], {
        relativeTo: this.activatedRoute,
      })
      .then();
  }

  onLogout(): void {
    // Clear accounts service
    this.accountsService.logout();

    // Toast
    this.toastService.success('Successfully logged out.', 'Status');

    // Navigate to home page
    this.router
      .navigate(['/landing-page'], {
        relativeTo: this.activatedRoute,
      })
      .then();
  }

  onToggleHamburger(): void {
    this.isHamburgerVisible = !this.isHamburgerVisible;
  }
}
