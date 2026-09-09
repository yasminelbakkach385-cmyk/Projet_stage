import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { TranslationService } from '../../services/translation';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email: string = '';
  password: string = '';
  erreur: string = '';
  chargement: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public t: TranslationService
  ) {}

  seConnecter(): void {
    this.erreur = '';
    this.chargement = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (reponse) => {
        this.authService.enregistrerSession(reponse.token, reponse.user);
        this.chargement = false;

        if (reponse.user.role === 'employe') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.erreur = this.t.t('erreurConnexion');
        this.chargement = false;
        this.cdr.detectChanges();
      }
    });
  }
}