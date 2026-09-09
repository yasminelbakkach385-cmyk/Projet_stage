import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslationService } from './services/translation';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend-temp');

  constructor(private translationService: TranslationService) {
    this.translationService.initialiser();
  }
}