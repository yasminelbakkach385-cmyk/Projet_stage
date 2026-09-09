import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { TranslationService } from '../../services/translation';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  name: string = '';
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

  sInscrire(): void {
    this.erreur = '';
    this.chargement = true;

    this.authService.register(this.name, this.email, this.password).subscribe({
      next: (reponse) => {
        this.chargement = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.erreur = this.t.t('erreurInscription');
        this.chargement = false;
        this.cdr.detectChanges();
      }
    });
  }
}