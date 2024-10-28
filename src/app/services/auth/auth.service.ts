import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../interfaces/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  login(auth: Auth): boolean {
    if (auth.email === 'admin' && auth.password === 'admin') {
      localStorage.setItem('token', 'token');
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('token') ? true : false;
  }
}