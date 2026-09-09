import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Header } from '../../components/header/header';
import { TranslationService } from '../../services/translation';
import { AuthService, Utilisateur } from '../../services/auth';

@Component({
  selector: 'app-parametres',
  imports: [CommonModule, RouterLink, Header],
  templateUrl: './parametres.html',
  styleUrl: './parametres.css'
})
export class Parametres {
  utilisateur: Utilisateur | null;

  constructor(
    public t: TranslationService,
    public authService: AuthService
  ) {
    this.utilisateur = this.authService.getUtilisateur();
  }

  seDeconnecter(): void {
    this.authService.logout().subscribe();
    this.authService.effacerSession();
    window.location.href = '/login';
  }
}