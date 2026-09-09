import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

export interface Plainte {
  id: number;
  titre: string;
  description: string;
  categorie: string;
  quartier: string | null;
  telephone: string | null;
  statut: string;
  urgent: number;
  photo: string | null;
  created_at: string;
  note: number | null;
  commentaire_citoyen: string | null;
  resume?: string | null;
  user?: { id: number; name: string; email: string } | null;
}

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

  getPlaintes(statut?: string): Observable<Plainte[]> {
    const url = statut
      ? `${this.apiUrl}/plaintes?statut=${statut}`
      : `${this.apiUrl}/plaintes`;
    return this.http.get<Plainte[]>(url, { headers: this.authService.getAuthHeaders() });
  }

  getPlainteParCode(code: string): Observable<Plainte> {
    return this.http.get<Plainte>(`${this.apiUrl}/plaintes/code/${code}`);
  }

  envoyerAvis(code: string, note: number, commentaire: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/plaintes/code/${code}/avis`, {
      note,
      commentaire_citoyen: commentaire || null,
    });
  }

  changerStatut(id: number, statut: string): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/plaintes/${id}`,
      { statut },
      { headers: this.authService.getAuthHeaders() }
    );
  }

  supprimerPlainte(id: number): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/plaintes/${id}`,
      { headers: this.authService.getAuthHeaders() }
    );
  }
}