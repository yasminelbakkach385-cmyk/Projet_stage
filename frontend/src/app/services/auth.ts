import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Utilisateur {
  id: number;
  name: string;
  email: string;
  telephone?: string | null;
  role: 'citoyen' | 'employe';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password });
  }

  register(name: string, email: string, password: string, telephone?: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { name, email, password, telephone });
  }

  logout(): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/logout`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  enregistrerSession(token: string, user: Utilisateur): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  effacerSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUtilisateur(): Utilisateur | null {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  }

  estConnecte(): boolean {
    return !!this.getToken();
  }

  estEmploye(): boolean {
    return this.getUtilisateur()?.role === 'employe';
  }

  getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`
    });
  }
}