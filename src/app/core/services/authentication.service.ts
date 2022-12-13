import { Injectable, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService implements OnInit {
  token!: string;

  constructor(private jwtHelper: JwtHelperService) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('access_token')!;
  }

  onLogin(jwt: string): void {
    // Save token
    this.token = jwt;
    localStorage.setItem('access_token', this.token);
  }

  isLoggedIn() {
    return !this.jwtHelper.isTokenExpired(this.token);
  }

  onLogout(): void {
    localStorage.removeItem('access_token');
  }
}
