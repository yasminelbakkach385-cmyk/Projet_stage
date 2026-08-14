import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardStats } from '../services/dashboard';
import { Chart, registerables } from 'chart.js';
import { interval, Subscription } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {
  stats: DashboardStats | null = null;
  chargement: boolean = true;
  erreurTexte: string = '';
  derniereMiseAJour: Date | null = null;

  @ViewChild('graphiqueCategorie') graphiqueCategorieRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graphiqueStatut') graphiqueStatutRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graphiqueQuartier') graphiqueQuartierRef!: ElementRef<HTMLCanvasElement>;

  private chartCategorie: Chart | null = null;
  private chartStatut: Chart | null = null;
  private chartQuartier: Chart | null = null;

  private intervalSubscription: Subscription | null = null;

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerDonnees();

    // Rafraîchissement automatique toutes les 15 secondes
    this.intervalSubscription = interval(15000).subscribe(() => {
      this.chargerDonnees();
    });
  }

  ngOnDestroy(): void {
    // Important : arrêter le minuteur quand on quitte la page
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  chargerDonnees(): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.chargement = false;
        this.erreurTexte = '';
        this.derniereMiseAJour = new Date();
        this.cdr.detectChanges();
        this.creerGraphiques();
      },
      error: (err) => {
        this.erreurTexte = 'Erreur : ' + err.status + ' - ' + err.message;
        this.chargement = false;
        this.cdr.detectChanges();
      }
    });
  }

  creerGraphiques(): void {
    if (!this.stats) return;

    // Détruire les anciens graphiques avant d'en recréer de nouveaux
    if (this.chartCategorie) this.chartCategorie.destroy();
    if (this.chartStatut) this.chartStatut.destroy();
    if (this.chartQuartier) this.chartQuartier.destroy();

    this.chartCategorie = new Chart(this.graphiqueCategorieRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.stats.par_categorie.map(item => item.categorie),
        datasets: [{
          label: 'Nombre de plaintes',
          data: this.stats.par_categorie.map(item => item.total),
          backgroundColor: '#8B5CF6'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });

    this.chartStatut = new Chart(this.graphiqueStatutRef.nativeElement, {
      type: 'pie',
      data: {
        labels: this.stats.par_statut.map(item => item.statut),
        datasets: [{
          data: this.stats.par_statut.map(item => item.total),
          backgroundColor: ['#F59E0B', '#3B82F6', '#10B981']
        }]
      },
      options: {
        responsive: true
      }
    });

    this.chartQuartier = new Chart(this.graphiqueQuartierRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.stats.par_quartier.map(item => item.quartier),
        datasets: [{
          label: 'Nombre de plaintes',
          data: this.stats.par_quartier.map(item => item.total),
          backgroundColor: '#EC4899'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });
  }
}