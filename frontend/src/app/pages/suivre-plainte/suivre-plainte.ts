import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from '../../components/header/header';
import { TranslationService } from '../../services/translation';
import { PlainteService } from '../../services/plainte';

interface Etape {
  cle: string;
  complete: boolean;
  actuelle: boolean;
}

interface ResultatRecherche {
  numero: string;
  domaine: string;
  description: string;
  etapes: Etape[];
}

@Component({
  selector: 'app-suivre-plainte',
  imports: [CommonModule, FormsModule, Header],
  templateUrl: './suivre-plainte.html',
  styleUrl: './suivre-plainte.css'
})
export class SuivrePlainte {
  numeroDossier: string = '';
  chargement = signal(false);
  erreur = signal('');
  resultat = signal<ResultatRecherche | null>(null);

  note = signal(0);
  commentaire: string = '';
  noteEnvoyee = signal(false);

  constructor(public t: TranslationService, private plainteService: PlainteService) {}

  rechercher(): void {
    this.erreur.set('');
    this.resultat.set(null);
    this.note.set(0);
    this.commentaire = '';
    this.noteEnvoyee.set(false);

    const code = this.numeroDossier.trim();

    if (!code) {
      this.erreur.set('dossierIntrouvable');
      return;
    }

    this.chargement.set(true);

    this.plainteService.getPlainteParCode(code).subscribe({
      next: (p: any) => {
        this.chargement.set(false);
        this.noteEnvoyee.set(!!p.note);
        this.resultat.set({
          numero: p.code_suivi,
          domaine: p.categorie,
          description: p.description,
          etapes: [
            { cle: 'statutEnAttente', complete: true, actuelle: p.statut === 'en_attente' },
            { cle: 'statutEnCoursCourt', complete: p.statut === 'en_cours' || p.statut === 'traite', actuelle: p.statut === 'en_cours' },
            { cle: 'statutTraiteCourt', complete: p.statut === 'traite', actuelle: p.statut === 'traite' },
          ]
        });
      },
      error: () => {
        this.chargement.set(false);
        this.erreur.set('dossierIntrouvable');
      }
    });
  }

    cleCategorie(categorie: string): string {
    const correspondances: Record<string, string> = {
      'Voirie': 'catVoirie',
      'Éclairage public': 'catEclairage',
      'Eau et assainissement': 'catEau',
      'Propreté': 'catProprete',
      'Espaces verts': 'catEspacesVerts',
      'Bruit et nuisances': 'catBruit',
      'Autre': 'catAutre',
    };
    return correspondances[categorie] || categorie;
  }
  choisirNote(valeur: number): void {
    this.note.set(valeur);
  }

  envoyerNote(): void {
    const r = this.resultat();
    if (!r) return;

    this.plainteService.envoyerAvis(r.numero, this.note(), this.commentaire).subscribe({
      next: () => this.noteEnvoyee.set(true),
      error: () => this.erreur.set('erreurEnvoi')
    });
  }
}