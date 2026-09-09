import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService, DashboardStats } from '../services/dashboard';
import { PlainteService, Plainte } from '../services/plainte';
import { Header } from '../components/header/header';
import { TranslationService } from '../services/translation';
import { AuthService } from '../services/auth';
import { Chart, registerables } from 'chart.js';
import { interval, Subscription } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, Header, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {
  stats: DashboardStats | null = null;
  chargement: boolean = true;
  erreurTexte: string = '';
  derniereMiseAJour: Date | null = null;

  reclamations: Plainte[] = [];
  private toutesReclamations: Plainte[] = [];

  @ViewChild('graphiqueCategorie') graphiqueCategorieRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graphiqueEvolution') graphiqueEvolutionRef!: ElementRef<HTMLCanvasElement>;

  private chartCategorie: Chart | null = null;
  private chartEvolution: Chart | null = null;
  private intervalSubscription: Subscription | null = null;

  constructor(
    private dashboardService: DashboardService,
    private plainteService: PlainteService,
    private cdr: ChangeDetectorRef,
    public t: TranslationService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.chargerDonnees();
    this.chargerReclamations();
    this.intervalSubscription = interval(15000).subscribe(() => {
      this.chargerDonnees();
      this.chargerReclamations();
    });
  }

  ngOnDestroy(): void {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  chargerDonnees(): void {
    this.dashboardService.getStats().subscribe({
      next: (data: DashboardStats) => {
        this.stats = data;
        this.chargement = false;
        this.erreurTexte = '';
        this.derniereMiseAJour = new Date();
        this.cdr.detectChanges();
        this.creerGraphiqueCategorie();
        this.creerGraphiqueEvolution();
      },
      error: (err: any) => {
        this.erreurTexte = 'Erreur : ' + err.status + ' - ' + err.message;
        this.chargement = false;
        this.cdr.detectChanges();
      }
    });
  }

  chargerReclamations(): void {
    this.plainteService.getPlaintes().subscribe({
      next: (data: Plainte[]) => {
        this.toutesReclamations = data;
        this.reclamations = data.slice(0, 6);
        this.cdr.detectChanges();
        this.creerGraphiqueEvolution();
      },
      error: () => {
        this.reclamations = [];
        this.toutesReclamations = [];
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
  trouverStatut(nom: string): number {
    return this.stats?.par_statut.find(s => s.statut === nom)?.total || 0;
  }

  cleStatut(statut: string): string {
    if (statut === 'en_attente') return 'statutEnAttente';
    if (statut === 'en_cours') return 'statutEnCoursCourt';
    return 'statutTraiteCourt';
  }

  classeStatut(statut: string): string {
    if (statut === 'en_attente') return 'badge-statut-rouge';
    if (statut === 'en_cours') return 'badge-statut-orange';
    return 'badge-statut-vert';
  }

  changerStatut(reclamation: Plainte, nouveauStatut: string): void {
    this.plainteService.changerStatut(reclamation.id, nouveauStatut).subscribe({
      next: () => this.chargerReclamations()
    });
  }

  supprimer(id: number): void {
    this.plainteService.supprimerPlainte(id).subscribe({
      next: () => this.chargerReclamations()
    });
  }

  creerGraphiqueCategorie(): void {
    if (!this.stats) return;
    if (this.chartCategorie) this.chartCategorie.destroy();

    this.chartCategorie = new Chart(this.graphiqueCategorieRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: this.stats.par_categorie.map((item: { categorie: string; total: number }) => this.t.t(this.cleCategorie(item.categorie))),
        datasets: [{
          data: this.stats.par_categorie.map((item: { categorie: string; total: number }) => item.total),
          backgroundColor: ['#17A6B5', '#0F2D4D', '#F5A623', '#2FA84F', '#7B68EE', '#E74C3C', '#8B5CF6']
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  creerGraphiqueEvolution(): void {
    if (!this.graphiqueEvolutionRef || this.toutesReclamations.length === 0) return;
    if (this.chartEvolution) this.chartEvolution.destroy();

    const moisNoms = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jui', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const compteurParMois: number[] = new Array(12).fill(0);

    this.toutesReclamations.forEach(r => {
      const date = new Date(r.created_at);
      const moisIndex = date.getMonth();
      compteurParMois[moisIndex]++;
    });

    const moisAvecDonnees = compteurParMois
      .map((total, index) => ({ total, label: moisNoms[index] }))
      .filter(m => m.total > 0);

    this.chartEvolution = new Chart(this.graphiqueEvolutionRef.nativeElement, {
      type: 'line',
      data: {
        labels: moisAvecDonnees.map(m => m.label),
        datasets: [{
          label: 'Total',
          data: moisAvecDonnees.map(m => m.total),
          borderColor: '#0F2D4D',
          backgroundColor: 'rgba(15, 45, 77, 0.08)',
          tension: 0.35,
          fill: true,
          pointBackgroundColor: '#17A6B5',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    });
  }

  seDeconnecter(): void {
    this.authService.logout().subscribe();
    this.authService.effacerSession();
    window.location.href = '/login';
  }
}