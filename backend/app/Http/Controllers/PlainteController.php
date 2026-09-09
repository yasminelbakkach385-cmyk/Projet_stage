<?php

namespace App\Http\Controllers;

use App\Models\Plainte;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PlainteController extends Controller
{
    // Lister toutes les plaintes (avec filtre optionnel par statut)
    public function index(Request $request)
    {
        $query = Plainte::with('user')->orderBy('created_at', 'desc');

        if ($request->has('statut')) {
            $query->where('statut', $request->query('statut'));
        }

        return response()->json($query->get());
    }

    // Créer une nouvelle plainte
    public function store(Request $request)
    {
        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'categorie' => 'required|string',
            'quartier' => 'required|string',
            'telephone' => 'nullable|string|max:20',
            'photo' => 'nullable|image|max:5120',
        ]);

        $validated['user_id'] = $request->user()->id;

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('plaintes', 'public');
        }

        // Appel au service IA pour détecter l'urgence et générer un résumé
        try {
            $reponseUrgence = Http::timeout(3)->post('http://ai-service:5000/detect-urgency', [
                'texte' => $validated['description'],
            ]);
            if ($reponseUrgence->successful()) {
                $validated['urgent'] = $reponseUrgence->json('urgent') ?? false;
            }
        } catch (\Exception $e) {
            // Si le service IA est indisponible, on continue sans bloquer la création
        }

        try {
            $reponseResume = Http::timeout(3)->post('http://ai-service:5000/summarize', [
                'texte' => $validated['description'],
            ]);
            if ($reponseResume->successful()) {
                $validated['resume'] = $reponseResume->json('resume');
            }
        } catch (\Exception $e) {
            // Si le service IA est indisponible, on continue sans bloquer la création
        }

        $plainte = Plainte::create($validated);

        return response()->json($plainte, 201);
    }

    // Afficher une plainte précise (usage interne/admin, par ID)
    public function show($id)
    {
        $plainte = Plainte::findOrFail($id);
        return response()->json($plainte);
    }

    // Chercher une plainte par son code de suivi public (usage citoyen)
    public function showParCode($code)
    {
        $plainte = Plainte::where('code_suivi', strtoupper($code))->first();

        if (!$plainte) {
            return response()->json(['message' => 'Plainte introuvable'], 404);
        }

        return response()->json($plainte);
    }

        // Enregistrer l'avis du citoyen (note + commentaire), via le code de suivi public
    public function envoyerAvis(Request $request, $code)
    {
        $plainte = Plainte::where('code_suivi', strtoupper($code))->first();

        if (!$plainte) {
            return response()->json(['message' => 'Plainte introuvable'], 404);
        }

        $validated = $request->validate([
            'note' => 'required|integer|min:1|max:5',
            'commentaire_citoyen' => 'nullable|string|max:1000',
        ]);

        $plainte->update($validated);

        return response()->json($plainte);
    }
    // Modifier une plainte (ex: changer son statut)
    public function update(Request $request, $id)
    {
        $plainte = Plainte::findOrFail($id);

        $validated = $request->validate([
            'statut' => 'sometimes|string',
            'titre' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'categorie' => 'sometimes|string',
            'quartier' => 'sometimes|nullable|string',
        ]);

        $plainte->update($validated);

        return response()->json($plainte);
    }

    // Supprimer une plainte
    public function destroy($id)
    {
        $plainte = Plainte::findOrFail($id);
        $plainte->delete();

        return response()->json(['message' => 'Plainte supprimée avec succès']);
    }
}