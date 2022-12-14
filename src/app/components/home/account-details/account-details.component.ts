import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountsService } from '../../../core/services/accounts.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Account } from '../../../core/models/account';
import { FormValidatorService } from '../../../core/services/form-validator.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { AdminPanelService } from '../../../core/services/admin-panel.service';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css'],
})
export class AccountDetailsComponent implements OnInit, OnDestroy {
  idSub: Subscription | undefined;
  updateAccountForm!: FormGroup;
  idParam!: string;
  targetAccount: Account | undefined;
  currentAccount!: Account;
  deletePromptStatus: boolean = false;
  profilePicture!: string;

  constructor(
    private accountsService: AccountsService,
    private adminPanelService: AdminPanelService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastrService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.currentAccount = this.accountsService.account!;

    this.idSub = this.activatedRoute.params.subscribe((param: Params): void => {
      this.idParam = param['id'];
      if (this.currentAccount.id == this.idParam) {
        this.targetAccount = this.currentAccount;
      } else {
        this.targetAccount = this.accountsService.accounts.find(
          (account: Account): boolean => {
            return account.id == this.idParam;
          }
        );
      }

      // Set up the profile picture
      this.profilePicture = `https://robohash.org/${this.targetAccount?.id}`;

      this.updateAccountForm = new FormGroup({
        name: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          FormValidatorService.noWhiteSpaceValidator,
        ]),
        email: new FormControl(
          '',
          [Validators.required, Validators.email],
          [FormValidatorService.emailExistsValidator(this.accountsService)]
        ),
        adminStatus: new FormControl('', [Validators.required]),
        accountStatus: new FormControl('', [Validators.required]),
      });

      if (this.targetAccount == null) {
        this.targetAccount = this.currentAccount;
      }

      this.updateAccountForm.setValue({
        name: this.targetAccount?.name,
        email: this.targetAccount?.email,
        adminStatus: this.targetAccount?.adminStatus,
        accountStatus: this.targetAccount?.accountStatus,
      });
    });
  }

  ngOnDestroy() {
    this.idSub?.unsubscribe();
  }

  onDeletePrompt(): void {
    this.deletePromptStatus = !this.deletePromptStatus;
  }

  onDelete(): void {
    this.accountsService
      .deleteAccount(this.targetAccount!)
      .subscribe((responseData) => {
        if (responseData.status === 1) {
          this.toastService.success(responseData.message, 'Status');
          this.onClear();

          // Check if own account is deleted
          if (this.currentAccount.id == this.targetAccount?.id) {
            this.onLogout();
          } else {
            this.location.back();
          }
        } else {
          this.toastService.error(responseData.message, 'Error');
        }
      });
  }

  onUpdate(): void {
    let formName: string = this.updateAccountForm.get('name')?.value;
    let formEmail: string = this.updateAccountForm.get('email')?.value;
    let formAdminStatus: number =
      this.updateAccountForm.get('adminStatus')?.value;
    let formAccountStatus: number =
      this.updateAccountForm.get('accountStatus')?.value;

    // TODO: Think of a better solution
    // No updates if no changes were made
    if (
      formName === this.targetAccount?.name &&
      formEmail === this.targetAccount?.email &&
      formAdminStatus === this.targetAccount?.adminStatus &&
      formAccountStatus === this.targetAccount?.accountStatus
    ) {
      this.toastService.error(
        'No new values submitted. Update cancelled.',
        'Update Status'
      );
    }

    // Update
    let newAccount: Account = this.targetAccount!;
    newAccount.name = formName;
    newAccount.email = formEmail;
    newAccount.adminStatus = formAdminStatus;
    newAccount.accountStatus = formAccountStatus;

    this.accountsService
      .updateAccount(newAccount)
      .subscribe((responseData): void => {
        console.log(`Current Account: ${this.currentAccount.id}`);
        console.log(`New Account: ${newAccount.id}`);
        console.log(`Target Account: ${this.targetAccount?.id}`);
        if (responseData.status === 1) {
          /*
            If the newAccount is equal to the current account AND
              If the newAccount's status is disabled, logout OR
              If the newAccount's admin status is disabled, logout
           */
          // If the newAccount is equal to the current account,
          //  and the newAccount's status is set to disabled, force logout
          if (
            newAccount.id == this.currentAccount.id &&
            (newAccount.accountStatus == 0 || newAccount.adminStatus == 0) &&
            this.currentAccount.adminStatus == 1
          ) {
            this.onLogout();
          } else {
            // If new account is the same as the target account
            // Update the local storage
            if (newAccount.id == this.accountsService.account?.id) {
              localStorage.setItem('account', JSON.stringify(newAccount));
            }

            this.toastService.success(responseData.message, 'Status');
            this.onClear();
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
        } else {
          this.toastService.error(responseData.message, 'Error');
        }
      });
  }

  onLogout(): void {
    this.accountsService.logout();

    this.toastService.success('Successfully logged out.', 'Status');

    // Navigate to home page
    this.router.navigate(['/landing-page'], {
      relativeTo: this.activatedRoute,
    });
  }

  onGoBack(): void {
    this.location.back();
  }

  onClear(): void {
    this.updateAccountForm.reset();
    this.updateAccountForm.get('name')?.setValue(this.targetAccount?.name);
    this.updateAccountForm.get('email')?.setValue(this.targetAccount?.email);
    this.updateAccountForm
      .get('adminStatus')
      ?.setValue(this.targetAccount?.adminStatus);
    this.updateAccountForm
      .get('accountStatus')
      ?.setValue(this.targetAccount?.accountStatus);
  }
}
