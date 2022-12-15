import {Injectable, OnInit} from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService implements OnInit {
  constructor(private jwtHelper: JwtHelperService) {
  }

  ngOnInit(): void {
  }

  onLogin(jwt: string): void {
    // Save token
    localStorage.setItem('access_token', jwt);
  }

  isLoggedIn(): boolean {
    const token: string = localStorage.getItem('access_token') ?? '';
    return !this.jwtHelper.isTokenExpired(token);
  }

  onLogout(): void {
    localStorage.clear();
  }
}
