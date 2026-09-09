import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

export interface Annonce {
  id: number;
  titre: string;
  contenu: string;
  user_id: number | null;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class AnnonceService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAnnonces(): Observable<Annonce[]> {
    return this.http.get<Annonce[]>(`${this.apiUrl}/annonces`);
  }

  getAnnonce(id: number): Observable<Annonce> {
    return this.http.get<Annonce>(`${this.apiUrl}/annonces/${id}`);
  }

  creerAnnonce(donnees: { titre: string; contenu: string }): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/annonces`,
      donnees,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  supprimerAnnonce(id: number): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/annonces/${id}`,
      { headers: this.authService.getAuthHeaders() }
    );
  }
}