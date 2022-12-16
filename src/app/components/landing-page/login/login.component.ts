import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {LoginCredentials} from '../../../core/models/login-credentials';
import {AccountsService} from '../../../core/services/accounts.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {AuthenticationService} from '../../../core/services/authentication.service';

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
    private authService: AuthenticationService,
    private toastService: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

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
          // Save token
          this.authService.onLogin(responseData.jwt);

          this.toastService.success(responseData.message, 'Welcome');

          this.loginForm.reset();

          this.accountsService.account = responseData.account;
          // Save account
          localStorage.setItem('account', JSON.stringify(this.accountsService.account));

          if (this.accountsService.account?.adminStatus == 1) {
            this.router
              .navigate(['/home', 'admin-panel'], {
                relativeTo: this.activatedRoute,
                queryParams: {page: 1, order: 1, search: ''},
              })
              .then();
          } else {
            this.router
              .navigate(
                ['/home', 'account-details', this.accountsService.account?.id],
                {
                  relativeTo: this.activatedRoute,
                }
              )
              .then();
          }
        } else if (responseData.status === 2) {
          this.toastService.info(responseData.message, 'Notice');
        } else if (responseData.status === 3) {
          this.toastService.error(responseData.message, 'Warning');
        }
      });
  }

  ngOnDestroy(): void {
    this.loginSub?.unsubscribe();
  }

  addBootstrapClass(element: string): { [tag: string]: boolean } {
    let tag: AbstractControl = this.loginForm.get(element)!;
    return {
      'is-valid': tag.valid && tag.touched,
      'is-invalid': tag.invalid && tag.touched,
    };
  }
}
