import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslationService } from '../../services/translation';
import { Header } from '../../components/header/header';
import { AuthService } from '../../services/auth';
import { AnnonceService, Annonce } from '../../services/annonce';

@Component({
  selector: 'app-accueil',
  imports: [CommonModule, RouterLink, Header],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css'
})
export class Accueil implements OnInit {
  annonces: Annonce[] = [];

  constructor(
    public t: TranslationService,
    public authService: AuthService,
    private router: Router,
    private annonceService: AnnonceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.authService.estEmploye()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.annonceService.getAnnonces().subscribe({
      next: (data) => {
        this.annonces = data.slice(0, 3);
        this.cdr.detectChanges();
      },
      error: () => {
        this.annonces = [];
        this.cdr.detectChanges();
      }
    });
  }
}