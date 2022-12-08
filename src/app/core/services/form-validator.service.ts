import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl } from '@angular/forms';
import { AccountsService } from './accounts.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormValidatorService {
  constructor(private accountsService: AccountsService) {}

  // https://stackoverflow.com/questions/39236992/how-to-validate-white-spaces-empty-spaces-angular-2
  static noWhiteSpaceValidator(formControl: FormControl) {
    const isWhiteSpace: boolean = (formControl.value || '').trim().length === 0;
    return isWhiteSpace ? { whitespace: true } : null;
  }

  static confirmPasswordValidator(formGroup: AbstractControl): any {
    const password: string = formGroup.get('password')?.value;
    const confirmPassword: string = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      // Set an error to confirmPassword
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    }
    return null;
  }

  // static emailExistsValidator(
  //   formControl: FormControl
  // ): Observable<ValidationErrors> | null {
  //   inject(AccountsService)
  //     .checkEmail(formControl.get('email')?.value)
  //     .subscribe((responseData) => {
  //       // return responseData.status ? { emailInUse: true } : null;
  //       if (responseData.status === 1) {
  //         return { emailInUse: true };
  //       } else {
  //         return null;
  //       }
  //     });
  //   return null;
  // }

  // Study more
  // https://www.concretepage.com/angular-2/angular-custom-async-validator-example
  static emailExistsValidator(
    accountsService: AccountsService
  ): AsyncValidatorFn {
    return (control: AbstractControl): any => {
      return accountsService.checkEmail(control?.value).pipe(
        map((responseData) => {
          return responseData.status === 1 ? { emailInUse: true } : null;
        })
      );
    };
  }
}
