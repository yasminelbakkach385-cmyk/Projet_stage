import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardStats {
  total: number;
  par_categorie: { categorie: string; total: number }[];
  par_statut: { statut: string; total: number }[];
  urgentes: number;
  par_quartier: { quartier: string; total: number }[];
  evolution_7_jours: { jour: string; total: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8000/api/dashboard/stats';

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(this.apiUrl);
  }
}