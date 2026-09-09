# Shikayat — Plateforme de Gestion des Réclamations Municipales

Application web bilingue (français/arabe) développée dans le cadre d'un stage à la Commune de Fnideq, permettant aux citoyens de signaler des problèmes municipaux et aux employés communaux de les traiter efficacement.

## Fonctionnalités

- Dépôt de réclamation par les citoyens (catégorie, quartier, description, photo)
- Génération automatique d'un code de suivi unique (`FN-XXXXXX`)
- Suivi de dossier public via ce code
- Avis de satisfaction citoyen (note + commentaire) une fois la réclamation traitée
- Espace administrateur : filtres (statut, quartier, urgence), changement de statut, détails
- Tableau de bord statistique en temps réel (Chart.js)
- Carte interactive des réclamations par quartier (Leaflet)
- Module d'intelligence artificielle : détection automatique de l'urgence et résumé automatique de la description (bilingue FR/AR)
- Interface entièrement bilingue français/arabe avec adaptation RTL

## Stack technique

- **Frontend** : Angular (composants standalone, signaux)
- **Backend** : Laravel + Sanctum
- **Base de données** : MySQL 8
- **IA** : Python, Flask, scikit-learn (TF-IDF + SVM)
- **Conteneurisation** : Docker Compose

## Lancer le projet

```bash
docker compose up -d
```

- Frontend : http://localhost:4200
- Backend API : http://localhost:8000
- Service IA : http://localhost:5000

## Équipe

Projet réalisé par Narjis El Bakkach et Yassmina El Bakkach.
