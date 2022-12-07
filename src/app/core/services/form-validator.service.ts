import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

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

  static confirmPasswordValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    const isEqual = password == confirmPassword;

    return isEqual ? { confirmPassword: true }: null;
  }
}
