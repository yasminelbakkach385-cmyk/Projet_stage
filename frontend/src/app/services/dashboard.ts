import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StatItem {
  [key: string]: string | number;
}

export interface DashboardStats {
  total: number;
  urgentes: number;
  par_categorie: { categorie: string; total: number }[];
  par_statut: { statut: string; total: number }[];
  par_quartier: { quartier: string; total: number }[];
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