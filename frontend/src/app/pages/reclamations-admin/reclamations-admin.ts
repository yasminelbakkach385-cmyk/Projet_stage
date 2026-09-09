import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Header } from '../../components/header/header';
import { PlainteService, Plainte } from '../../services/plainte';
import { TranslationService } from '../../services/translation';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-reclamations-admin',
  imports: [CommonModule, FormsModule, RouterLink, Header],
  templateUrl: './reclamations-admin.html',
  styleUrl: './reclamations-admin.css'
})
export class ReclamationsAdmin implements OnInit {
  toutes: Plainte[] = [];
  filtrees: Plainte[] = [];
  filtreStatut: string = 'tous';
  recherche: string = '';
  chargement: boolean = true;
  plainteSelectionnee: Plainte | null = null;
    plainteAvisSelectionnee: Plainte | null = null;

  constructor(
    private plainteService: PlainteService,
    private cdr: ChangeDetectorRef,
    public t: TranslationService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.chargement = true;
    this.plainteService.getPlaintes().subscribe({
      next: (data) => {
        this.toutes = data;
        this.appliquerFiltres();
        this.chargement = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toutes = [];
        this.filtrees = [];
        this.chargement = false;
        this.cdr.detectChanges();
      }
    });
  }

  appliquerFiltres(): void {
    const rechercheMinuscule = this.recherche.toLowerCase();

    this.filtrees = this.toutes.filter(r => {
      const correspondStatut = this.filtreStatut === 'tous'
        || (this.filtreStatut === 'urgent' ? !!r.urgent : r.statut === this.filtreStatut);
      const correspondQuartier = (r.quartier || '').toLowerCase().startsWith(rechercheMinuscule);
      return correspondStatut && correspondQuartier;
    });
  }

  changerFiltre(statut: string): void {
    this.filtreStatut = statut;
    this.appliquerFiltres();
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
  ouvrirDetails(r: Plainte): void {
    this.plainteSelectionnee = r;
  }

  fermerDetails(): void {
    this.plainteSelectionnee = null;
  }
  
  ouvrirAvis(r: Plainte): void {
    this.plainteAvisSelectionnee = r;
  }

  fermerAvis(): void {
    this.plainteAvisSelectionnee = null;
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
      next: () => this.charger()
    });
  }

  supprimer(id: number): void {
    this.plainteService.supprimerPlainte(id).subscribe({
      next: () => this.charger()
    });
  }

  seDeconnecter(): void {
    this.authService.logout().subscribe();
    this.authService.effacerSession();
    window.location.href = '/login';
  }
}