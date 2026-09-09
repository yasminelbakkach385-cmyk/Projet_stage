import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class PlainteService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  creerPlainte(donnees: FormData): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/plaintes`,
      donnees,
      { headers: this.authService.getAuthHeaders() }
    );
  }
}