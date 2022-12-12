import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormValidatorService } from '../../../core/services/form-validator.service';
import { Account } from '../../../core/models/account';
import { AccountsService } from '../../../core/services/accounts.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm!: FormGroup;
  registerSub: Subscription | undefined;

  constructor(
    // Alert
    private toastService: ToastrService,
    private accountsService: AccountsService
  ) {}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
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
    });

    // Set the validators for the whole form group
    this.registerForm.setValidators(
      FormValidatorService.confirmPasswordValidator
    );
  }

  onRegister() {
    let account: Account = new Account(
      null,
      this.registerForm.get('name')?.value,
      this.registerForm.get('email')?.value,
      this.registerForm.get('password')?.value,
      null,
      0,
      1
    );

    this.registerSub = this.accountsService
      .registerAccount(account)
      .subscribe((responseData) => {
        if (responseData.status === 1) {
          this.toastService.success(responseData.message, 'Status');
        } else {
          this.toastService.error(responseData.message, 'Warning');
        }
      });

    // Clear the form
    this.registerForm.reset();
  }

  ngOnDestroy(): void {
    this.registerSub?.unsubscribe();
  }
}
