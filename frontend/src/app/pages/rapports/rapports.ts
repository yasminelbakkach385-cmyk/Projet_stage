import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Header } from '../../components/header/header';
import { DashboardService, DashboardStats } from '../../services/dashboard';
import { TranslationService } from '../../services/translation';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-rapports',
  imports: [CommonModule, RouterLink, Header],
  templateUrl: './rapports.html',
  styleUrl: './rapports.css'
})
export class Rapports implements OnInit {
  stats: DashboardStats | null = null;
  chargement: boolean = true;

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
    public t: TranslationService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.chargement = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.chargement = false;
        this.cdr.detectChanges();
      }
    });
  }
  cleCategorie(categorie: string): string {
    const normalise = (categorie || '').normalize('NFC').trim().toLowerCase();
    const correspondances: Record<string, string> = {
      'voirie': 'catVoirie',
      'éclairage public': 'catEclairage',
      'eau et assainissement': 'catEau',
      'propreté': 'catProprete',
      'espaces verts': 'catEspacesVerts',
      'bruit et nuisances': 'catBruit',
      'autre': 'catAutre',
    };
    return correspondances[normalise] || categorie;
  }

  cleStatutRapport(statut: string): string {
    if (statut === 'en_attente') return 'statutEnAttente';
    if (statut === 'en_cours') return 'statutEnCoursCourt';
    if (statut === 'traite') return 'statutTraiteCourt';
    return statut;
  }
  pourcentage(valeur: number): number {
    if (!this.stats || this.stats.total === 0) return 0;
    return Math.round((valeur / this.stats.total) * 100);
  }

  seDeconnecter(): void {
    this.authService.logout().subscribe();
    this.authService.effacerSession();
    window.location.href = '/login';
  }
}