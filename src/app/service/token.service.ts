import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private jwtHelper: JwtHelperService = new JwtHelperService();
  private jwtTokenKey = 'jwtToken';
  private refreshTokenKey = 'refreshToken';

  constructor() {}

  generateJwtToken(token: string): void {
    localStorage.setItem(this.jwtTokenKey, token);
  }

  generateRefreshToken(token: string): void {
    localStorage.setItem(this.refreshTokenKey, token);
  }

  isJwtTokenValid(): boolean {
    const jwtToken = localStorage.getItem(this.jwtTokenKey);
    return !!jwtToken && !this.jwtHelper.isTokenExpired(jwtToken);
  }

  getJwtToken(): string | null {
    return localStorage.getItem(this.jwtTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  clearTokens() {
    localStorage.removeItem(this.jwtTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }
}
