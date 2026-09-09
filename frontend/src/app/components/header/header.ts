import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';
import { TranslationService } from '../../services/translation';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  constructor(
    public authService: AuthService,
    public t: TranslationService
  ) {}

  seDeconnecter(): void {
    this.authService.logout().subscribe();
    this.authService.effacerSession();
    window.location.href = '/login';
  }
}