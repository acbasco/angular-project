import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {AccountsService} from "../../../core/services/accounts.service";
import {Account} from "../../../core/models/account";
import {FormValidatorService} from "../../../core/services/form-validator.service";
import {Location} from "@angular/common";

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {
  createAccountForm!: FormGroup;
  createAccountSub: Subscription | undefined;

  constructor(
    private location: Location,
    private toastService: ToastrService,
    private accountsService: AccountsService
  ) { }

  ngOnInit(): void {
    this.createAccountForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        FormValidatorService.noWhiteSpaceValidator,
      ]),
      email: new FormControl(
        null,
        [Validators.required, Validators.email],
        [FormValidatorService.emailExistsValidator(this.accountsService)]
      ),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
      confirmPassword: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
      adminStatus: new FormControl('', [Validators.required]),
      accountStatus: new FormControl('', [Validators.required]),
    });

    // Set the validators for the whole form group
    this.createAccountForm.setValidators(
      FormValidatorService.confirmPasswordValidator
    );
  }

  onRegister() {
    let account: Account = new Account(
      null,
      this.createAccountForm.get('name')?.value,
      this.createAccountForm.get('email')?.value,
      this.createAccountForm.get('password')?.value,
      null,
      this.createAccountForm.get('adminStatus')?.value,
      this.createAccountForm.get('accountStatus')?.value
    );

    this.createAccountSub = this.accountsService
      .registerAccount(account)
      .subscribe((responseData) => {
        if (responseData.status === 1) {
          this.toastService.success(responseData.message, 'Status');
        } else {
          this.toastService.error(responseData.message, 'Warning');
        }
      });

    // Clear the form
    this.createAccountForm.reset();
  }

  ngOnDestroy(): void {
    this.createAccountSub?.unsubscribe();
  }

  onGoBack(): void {
    this.location.back();
  }

  addBootstrapClass(element: string): { [tag: string]: boolean } {
    let tag: AbstractControl = this.createAccountForm.get(element)!;
    return {
      'is-valid': tag.valid && tag.touched,
      'is-invalid': tag.invalid && tag.touched,
    };
  }
}
