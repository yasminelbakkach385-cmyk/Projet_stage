<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Plainte;
use App\Models\User;

class PlainteSeeder extends Seeder
{
    public function run(): void
    {
        // Créer un utilisateur de test si aucun n'existe
        $user = User::first();
        if (!$user) {
            $user = User::factory()->create([
                'name' => 'Citoyen Test',
                'email' => 'citoyen@test.com',
            ]);
        }

        $plaintes = [
            ['titre' => 'Nid de poule dangereux', 'categorie' => 'Voirie', 'statut' => 'en_attente', 'urgent' => true, 'quartier' => 'Centre'],
            ['titre' => 'Route abîmée', 'categorie' => 'Voirie', 'statut' => 'en_cours', 'urgent' => false, 'quartier' => 'Nord'],
            ['titre' => 'Lampadaire cassé', 'categorie' => 'Éclairage public', 'statut' => 'traite', 'urgent' => false, 'quartier' => 'Centre'],
            ['titre' => 'Rue sombre la nuit', 'categorie' => 'Éclairage public', 'statut' => 'en_attente', 'urgent' => false, 'quartier' => 'Sud'],
            ['titre' => 'Fuite d\'eau importante', 'categorie' => 'Eau et assainissement', 'statut' => 'en_cours', 'urgent' => true, 'quartier' => 'Nord'],
            ['titre' => 'Égout bouché', 'categorie' => 'Eau et assainissement', 'statut' => 'en_attente', 'urgent' => false, 'quartier' => 'Centre'],
            ['titre' => 'Poubelles non ramassées', 'categorie' => 'Propreté', 'statut' => 'traite', 'urgent' => false, 'quartier' => 'Sud'],
            ['titre' => 'Décharge sauvage', 'categorie' => 'Propreté', 'statut' => 'en_attente', 'urgent' => false, 'quartier' => 'Nord'],
            ['titre' => 'Parc mal entretenu', 'categorie' => 'Espaces verts', 'statut' => 'en_cours', 'urgent' => false, 'quartier' => 'Centre'],
            ['titre' => 'Musique trop forte', 'categorie' => 'Bruit et nuisances', 'statut' => 'en_attente', 'urgent' => false, 'quartier' => 'Sud'],
            ['titre' => 'Problème avec la mairie', 'categorie' => 'Autre', 'statut' => 'traite', 'urgent' => false, 'quartier' => 'Centre'],
            ['titre' => 'Câble électrique dénudé', 'categorie' => 'Éclairage public', 'statut' => 'en_attente', 'urgent' => true, 'quartier' => 'Nord'],
        ];

        foreach ($plaintes as $plainte) {
            Plainte::create([
                'user_id' => $user->id,
                'titre' => $plainte['titre'],
                'description' => $plainte['titre'] . ' - description détaillée du problème signalé par le citoyen.',
                'categorie' => $plainte['categorie'],
                'statut' => $plainte['statut'],
                'urgent' => $plainte['urgent'],
                'quartier' => $plainte['quartier'],
            ]);
        }
    }
}