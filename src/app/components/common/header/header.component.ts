import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsService } from '../../../core/services/accounts.service';
import {ToastrService} from "ngx-toastr";

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
    private activateRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  onLogout(): void {
    // Clear accounts service
    this.accountsService.logout();

    // Toast
    this.toastService.success('Successfully logged out.', 'Status', {
      closeButton: true,
      tapToDismiss: true,
      timeOut: 5000,
      positionClass: 'toast-bottom-center'
    });

    // Navigate to home page
    this.router.navigate([''], {relativeTo: this.activateRoute});
  }
}
