import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Header } from '../../components/header/header';
import { DashboardService, DashboardStats } from '../../services/dashboard';
import { TranslationService } from '../../services/translation';
import { AuthService } from '../../services/auth';

declare const L: any;

interface QuartierCompte {
  quartier: string;
  total: number;
}

@Component({
  selector: 'app-carte-admin',
  imports: [CommonModule, RouterLink, Header],
  templateUrl: './carte-admin.html',
  styleUrl: './carte-admin.css',
  encapsulation: ViewEncapsulation.None
})
export class CarteAdmin implements OnInit, AfterViewInit {
  stats: DashboardStats | null = null;
  chargement: boolean = true;

  private carte: any = null;

  constructor(
    private dashboardService: DashboardService,
    private http: HttpClient,
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
        this.dessinerCarte();
      },
      error: () => {
        this.chargement = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngAfterViewInit(): void {}

  dessinerCarte(): void {
    if (!this.stats || this.carte) return;

    this.carte = L.map('carte-leaflet').setView([35.8511, -5.3591], 13);

    setTimeout(() => {
      this.carte.invalidateSize();
    }, 100);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(this.carte);

    const quartiersValides = this.stats.par_quartier.filter(q => q.quartier);
    const max = Math.max(...quartiersValides.map(q => q.total), 1);

    this.geolocaliserQuartiers(quartiersValides, max, 0);
  }

  private geolocaliserQuartiers(quartiers: QuartierCompte[], max: number, index: number): void {
    if (index >= quartiers.length) return;

    const q = quartiers[index];
    const requete = encodeURIComponent(`${q.quartier}, Fnideq, Maroc`);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${requete}&limit=1&viewbox=-5.45,35.90,-5.25,35.80&bounded=1`;

    this.http.get<any[]>(url).subscribe({
      next: (resultats) => {
        if (resultats && resultats.length > 0) {
          const lat = parseFloat(resultats[0].lat);
          const lon = parseFloat(resultats[0].lon);
          this.ajouterCercle(lat, lon, q, max);
        }
        setTimeout(() => this.geolocaliserQuartiers(quartiers, max, index + 1), 1100);
      },
      error: () => {
        setTimeout(() => this.geolocaliserQuartiers(quartiers, max, index + 1), 1100);
      }
    });
  }

  private ajouterCercle(lat: number, lon: number, q: QuartierCompte, max: number): void {
    const intensite = q.total / max;
    const couleur = intensite > 0.66 ? '#E74C3C' : intensite > 0.33 ? '#F5A623' : '#2FA84F';
    const rayon = 15 + intensite * 20;

    L.circleMarker([lat, lon], {
      radius: rayon,
      fillColor: couleur,
      color: '#fff',
      weight: 2,
      fillOpacity: 0.75
    })
      .addTo(this.carte)
      .bindPopup(`<strong>${q.quartier}</strong><br>${q.total} réclamation(s)`);
  }

  seDeconnecter(): void {
    this.authService.logout().subscribe();
    this.authService.effacerSession();
    window.location.href = '/login';
  }
}