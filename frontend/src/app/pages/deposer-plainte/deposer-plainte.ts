import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { PlainteService } from '../../services/plainte';
import { TranslationService } from '../../services/translation';
import { Header } from '../../components/header/header';

interface CategorieOption {
  valeur: string;
  labelKey: string;
  icone: string;
}

@Component({
  selector: 'app-deposer-plainte',
  imports: [CommonModule, FormsModule, RouterLink, Header],
  templateUrl: './deposer-plainte.html',
  styleUrl: './deposer-plainte.css'
})
export class DeposerPlainte implements OnInit {
  categories: CategorieOption[] = [
    { valeur: 'Voirie', labelKey: 'catVoirie', icone: 'route' },
    { valeur: 'Éclairage public', labelKey: 'catEclairage', icone: 'ampoule' },
    { valeur: 'Eau et assainissement', labelKey: 'catEau', icone: 'goutte' },
    { valeur: 'Propreté', labelKey: 'catProprete', icone: 'poubelle' },
    { valeur: 'Espaces verts', labelKey: 'catEspacesVerts', icone: 'feuille' },
    { valeur: 'Bruit et nuisances', labelKey: 'catBruit', icone: 'haut-parleur' },
    { valeur: 'Autre', labelKey: 'catAutre', icone: 'points' }
  ];

  categorieChoisie: string = '';
  titre: string = '';
  description: string = '';
  quartier: string = '';
  telephone: string = '';
  photo: File | null = null;
  nomPhoto: string = '';

  chargement: boolean = false;
  erreur: string = '';
  succes: boolean = false;
  numeroSuivi: string | null = null;

  constructor(
    private authService: AuthService,
    private plainteService: PlainteService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public t: TranslationService
  ) {}

  ngOnInit(): void {
    if (!this.authService.estConnecte()) {
      this.router.navigate(['/login']);
    }
  }

  choisirCategorie(valeur: string): void {
    this.categorieChoisie = valeur;
  }

  surChangementPhoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.photo = input.files[0];
      this.nomPhoto = input.files[0].name;
    }
  }

  envoyer(): void {
    this.erreur = '';

    if (!this.categorieChoisie || !this.titre || !this.quartier || !this.description) {
      this.erreur = this.t.t('champsObligatoires');
      return;
    }

    if (this.telephone && !/^(0|\+212)[67][0-9]{8}$/.test(this.telephone)) {
      this.erreur = this.t.t('telephoneInvalide');
      return;
    }

    this.chargement = true;

    const donnees = new FormData();
    donnees.append('titre', this.titre);
    donnees.append('description', this.description);
    donnees.append('categorie', this.categorieChoisie);
    if (this.quartier) donnees.append('quartier', this.quartier);
    if (this.telephone) donnees.append('telephone', this.telephone);
    if (this.photo) donnees.append('photo', this.photo);

    this.plainteService.creerPlainte(donnees).subscribe({
      next: (reponse) => {
        this.chargement = false;
        this.succes = true;
        this.numeroSuivi = reponse.code_suivi;
        this.cdr.detectChanges();
      },
      error: () => {
        this.chargement = false;
        this.erreur = this.t.t('erreurEnvoi');
        this.cdr.detectChanges();
      }
    });
  }
}