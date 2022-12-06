import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  isRegisterSelected: boolean = true;

  constructor() {}

  ngOnInit(): void {}

  onFormSelect(choice: boolean): void {
    this.isRegisterSelected = choice;
  }
}
