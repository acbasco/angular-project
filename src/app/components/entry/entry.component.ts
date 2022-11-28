import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent implements OnInit {
  isRegisterSelected: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  onFormSelect(choice: boolean): void {
    this.isRegisterSelected = choice;
  }
}
