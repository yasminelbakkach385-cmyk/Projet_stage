import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Header } from '../../components/header/header';
import { AnnonceService, Annonce } from '../../services/annonce';
import { TranslationService } from '../../services/translation';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-annonces-admin',
  imports: [CommonModule, FormsModule, RouterLink, Header],
  templateUrl: './annonces-admin.html',
  styleUrl: './annonces-admin.css'
})
export class AnnoncesAdmin implements OnInit {
  annonces: Annonce[] = [];
  chargement: boolean = true;

  nouveauTitre: string = '';
  nouveauContenu: string = '';
  envoiEnCours: boolean = false;

  constructor(
    private annonceService: AnnonceService,
    private cdr: ChangeDetectorRef,
    public t: TranslationService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.chargement = true;
    this.annonceService.getAnnonces().subscribe({
      next: (data) => {
        this.annonces = data;
        this.chargement = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.annonces = [];
        this.chargement = false;
        this.cdr.detectChanges();
      }
    });
  }

  ajouter(): void {
    if (!this.nouveauTitre.trim() || !this.nouveauContenu.trim()) return;

    this.envoiEnCours = true;
    this.annonceService.creerAnnonce({
      titre: this.nouveauTitre,
      contenu: this.nouveauContenu
    }).subscribe({
      next: () => {
        this.nouveauTitre = '';
        this.nouveauContenu = '';
        this.envoiEnCours = false;
        this.charger();
      },
      error: () => {
        this.envoiEnCours = false;
        this.cdr.detectChanges();
      }
    });
  }

  supprimer(id: number): void {
    this.annonceService.supprimerAnnonce(id).subscribe({
      next: () => this.charger()
    });
  }

  seDeconnecter(): void {
    this.authService.logout().subscribe();
    this.authService.effacerSession();
    window.location.href = '/login';
  }
}