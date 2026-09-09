import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../components/header/header';
import { TranslationService } from '../../services/translation';

@Component({
  selector: 'app-a-propos',
  imports: [CommonModule, Header],
  templateUrl: './a-propos.html',
  styleUrl: './a-propos.css'
})
export class APropos {
  constructor(public t: TranslationService) {}
}