import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  alertStatus:boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  onRegister() {
    this.alertStatus = !this.alertStatus;
  }

}
