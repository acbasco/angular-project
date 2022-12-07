import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormValidatorService } from '../../../core/services/form-validator.service';
import { Account } from '../../../core/models/account';
import { HttpClient } from '@angular/common/http';
import { AccountsService } from '../../../core/services/accounts.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  alertStatus: boolean = false;

  constructor(private accountsService: AccountsService) {}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        FormValidatorService.noWhiteSpaceValidator,
      ]),
      email: new FormControl(null, [Validators.required, Validators.email]),
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

    this.accountsService.fetchAccounts().subscribe((accounts) => {});
  }

  onRegister() {
    this.alertStatus = !this.alertStatus;

    let account: Account = new Account(
      null,
      this.registerForm.get('name')?.value,
      this.registerForm.get('email')?.value,
      this.registerForm.get('password')?.value
    );

    this.accountsService.createAccount(account);
  }
}
