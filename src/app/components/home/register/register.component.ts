import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormValidatorService } from '../../../core/services/form-validator.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  alertStatus: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        FormValidatorService.noWhiteSpaceValidator,
      ]),
    });
  }

  onRegister() {
    this.alertStatus = !this.alertStatus;
  }
}