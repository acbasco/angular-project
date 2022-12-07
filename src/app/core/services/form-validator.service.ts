import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormValidatorService {
  constructor() {}

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

  static emailExistsValidator(formControl: FormControl) {
    // const promise: Promise<any>()
  }
}
