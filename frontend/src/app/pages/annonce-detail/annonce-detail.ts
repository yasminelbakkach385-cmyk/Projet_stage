import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Header } from '../../components/header/header';
import { TranslationService } from '../../services/translation';
import { AnnonceService, Annonce } from '../../services/annonce';

@Component({
  selector: 'app-annonce-detail',
  imports: [CommonModule, RouterLink, Header],
  templateUrl: './annonce-detail.html',
  styleUrl: './annonce-detail.css'
})
export class AnnonceDetail implements OnInit {
  annonce: Annonce | null = null;
  chargement: boolean = true;
  introuvable: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private annonceService: AnnonceService,
    private cdr: ChangeDetectorRef,
    public t: TranslationService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.annonceService.getAnnonce(id).subscribe({
      next: (data) => {
        this.annonce = data;
        this.chargement = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.introuvable = true;
        this.chargement = false;
        this.cdr.detectChanges();
      }
    });
  }
}