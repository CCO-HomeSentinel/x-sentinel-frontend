import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../interfaces/auth';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  login(auth: Auth): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.apiUrl}/login`, auth).subscribe(
        (response: any) => {
          localStorage.setItem('token', "token");
          localStorage.setItem('user_name', "Kauan");
          localStorage.setItem('user_id', "14476");
          resolve(true); 
        },
        (error: any) => {
          console.error('Erro ao fazer login:', error);
          reject(false); 
        }
      );
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('token') ? true : false;
  }
}