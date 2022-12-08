import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginCredentials } from '../../../core/models/login-credentials';
import { AccountsService } from '../../../core/services/accounts.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  loginSub: Subscription | undefined;

  constructor(
    private accountsService: AccountsService,
    private toastService: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  onLogin() {
    let loginCredentials: LoginCredentials = new LoginCredentials(
      this.loginForm.get('email')?.value,
      this.loginForm.get('password')?.value
    );

    this.loginSub = this.accountsService
      .loginAccount(loginCredentials)
      .subscribe((responseData) => {
        if (responseData.status === 1) {
          this.toastService.success(responseData.message, 'Welcome', {
            closeButton: true,
            tapToDismiss: true,
            timeOut: 5000,
            positionClass: 'toast-bottom-center',
          });

          this.loginForm.reset();

          this.accountsService.account = responseData.account;
          if (this.accountsService.account!.adminStatus === 0) {
            // User only
            this.router.navigate(['account-details'], {
              relativeTo: this.activatedRoute,
            });
          } else {
            // Admin account
            this.router.navigate(['admin-panel'], {
              relativeTo: this.activatedRoute,
            });
          }
        } else if (responseData.status === 2) {
          this.toastService.info(responseData.message, 'Notice', {
            closeButton: true,
            tapToDismiss: true,
            timeOut: 5000,
            positionClass: 'toast-bottom-center',
          });
        } else if (responseData.status === 3) {
          this.toastService.error(responseData.message, 'Warning', {
            closeButton: true,
            tapToDismiss: true,
            timeOut: 5000,
            positionClass: 'toast-bottom-center',
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.loginSub?.unsubscribe();
  }
}
