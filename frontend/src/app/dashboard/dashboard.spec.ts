<div class="dashboard">
  <h1>Tableau de bord - Plaintes</h1>

  <div *ngIf="chargement">
    <p>Chargement en cours...</p>
  </div>

  <div *ngIf="erreurTexte">
    <p style="color: red;"><strong>Erreur :</strong> {{ erreurTexte }}</p>
  </div>

  <div *ngIf="stats && !chargement">
    <p><strong>Total des plaintes :</strong> {{ stats.total }}</p>
    <p><strong>Plaintes urgentes :</strong> {{ stats.urgentes }}</p>

    <h2>Par catégorie</h2>
    <ul>
      <li *ngFor="let item of stats.par_categorie">
        {{ item.categorie }} : {{ item.total }}
      </li>
    </ul>

    <h2>Par statut</h2>
    <ul>
      <li *ngFor="let item of stats.par_statut">
        {{ item.statut }} : {{ item.total }}
      </li>
    </ul>

    <h2>Par quartier</h2>
    <ul>
      <li *ngFor="let item of stats.par_quartier">
        {{ item.quartier }} : {{ item.total }}
      </li>
    </ul>

    <h2>Évolution (7 derniers jours)</h2>
    <ul>
      <li *ngFor="let item of stats.evolution_7_jours">
        {{ item.jour }} : {{ item.total }}
      </li>
    </ul>
  </div>
</div>