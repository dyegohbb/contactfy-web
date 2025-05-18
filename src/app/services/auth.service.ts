import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) { }

  register(username: string, email: string, password: string) {
    const payload = {
      username,
      email,
      password
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return firstValueFrom(
      this.http.post(`${this.apiUrl}/user`, payload, { headers })
    );
  }

  login(username: string, password: string) {
    const payload = {
      login: username,
      password
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': 'pt-br'
    });

    return firstValueFrom(
      this.http.post<any>(`${this.apiUrl}/auth`, payload, { headers })
    );
  }

  saveToken(token: string): void {
    localStorage.setItem('contactfy_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('contactfy_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('contactfy_token');
  }

  clearToken(): void {
    localStorage.removeItem('token');
  }
  
}