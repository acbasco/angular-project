import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsService } from '../../../core/services/accounts.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(
    private accountsService: AccountsService,
    private toastService: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  onViewAccount(): void {
    const id: number = this.accountsService.account?.id!;

    this.router.navigate(['account-details', id], {
      relativeTo: this.activatedRoute,
    });
  }

  onNavigateToAdminPanel(): void {
    this.router.navigate(['admin-panel'], {
      relativeTo: this.activatedRoute,
      queryParams: { page: 1 },
      queryParamsHandling: 'merge',
    });
  }

  onLogout(): void {
    // Clear accounts service
    this.accountsService.logout();

    // Toast
    this.toastService.success('Successfully logged out.', 'Status');

    // Navigate to home page
    this.router.navigate(['/landing-page'], {
      relativeTo: this.activatedRoute,
    });
  }
}
