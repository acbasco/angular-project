import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountsService } from '../../../core/services/accounts.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Account } from '../../../core/models/account';
import { FormValidatorService } from '../../../core/services/form-validator.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css'],
})
export class AccountDetailsComponent implements OnInit, OnDestroy {
  idSub: Subscription | undefined;
  updateAccountForm!: FormGroup;
  idParam!: number;
  targetAccount: Account | undefined;
  currentAccount!: Account;
  deletePromptStatus: boolean = false;

  constructor(
    private accountsService: AccountsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastrService,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.currentAccount = this.accountsService.account!;

    this.idSub = this.activatedRoute.params.subscribe((param: Params) => {
      this.idParam = param['id'];

      this.targetAccount = this.accountsService.accounts.find((account) => {
        return account.id == this.idParam;
      });
    });

    console.log(`CURRENT: ${this.currentAccount.email}`);
    console.log(`TARGET: ${this.targetAccount?.email}`);

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
          this.location.back();
        } else {
          this.toastService.error(responseData.message, 'Error');
        }
      });
  }

  onUpdate() {
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

    this.accountsService.updateAccount(newAccount).subscribe((responseData) => {
      if (responseData.status === 1) {
        this.toastService.success(responseData.message, 'Status');
        this.onClear();
        this.location.back();
      } else {
        this.toastService.error(responseData.message, 'Error');
      }
    });
  }

  onLogout() {
    this.accountsService.logout();

    // Toast
    this.toastService.success('Successfully logged out.', 'Status', {
      closeButton: true,
      tapToDismiss: true,
      timeOut: 5000,
      positionClass: 'toast-bottom-center',
    });

    // Navigate to home page
    this.router.navigate([''], { relativeTo: this.activatedRoute });
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
