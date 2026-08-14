<?php

namespace App\Http\Controllers;

use App\Models\Plainte;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats()
    {
        // Nombre total de plaintes
        $total = Plainte::count();

        // Répartition par catégorie
        $parCategorie = Plainte::selectRaw('categorie, COUNT(*) as total')
            ->whereNotNull('categorie')
            ->groupBy('categorie')
            ->get();

        // Répartition par statut
        $parStatut = Plainte::selectRaw('statut, COUNT(*) as total')
            ->groupBy('statut')
            ->get();

        // Nombre de plaintes urgentes
        $urgentes = Plainte::where('urgent', true)->count();

        // Répartition par quartier
        $parQuartier = Plainte::selectRaw('quartier, COUNT(*) as total')
            ->whereNotNull('quartier')
            ->groupBy('quartier')
            ->get();

        // Évolution des 7 derniers jours
        $evolution = Plainte::selectRaw('DATE(created_at) as jour, COUNT(*) as total')
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('jour')
            ->orderBy('jour')
            ->get();

        return response()->json([
            'total' => $total,
            'par_categorie' => $parCategorie,
            'par_statut' => $parStatut,
            'urgentes' => $urgentes,
            'par_quartier' => $parQuartier,
            'evolution_7_jours' => $evolution,
        ]);
    }
}