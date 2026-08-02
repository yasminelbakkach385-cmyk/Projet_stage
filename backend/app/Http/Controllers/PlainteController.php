<?php

namespace App\Http\Controllers;

use App\Models\Plainte;
use Illuminate\Http\Request;

class PlainteController extends Controller
{
    // Lister toutes les plaintes
    public function index()
    {
        $plaintes = Plainte::with('user')->latest()->get();
        return response()->json($plaintes);
    }

    // Créer une nouvelle plainte
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $plainte = Plainte::create($validated);

        return response()->json($plainte, 201);
    }

    // Voir une plainte précise
    public function show(string $id)
    {
        $plainte = Plainte::with('user')->findOrFail($id);
        return response()->json($plainte);
    }

    // Modifier une plainte (ex: changer le statut)
    public function update(Request $request, string $id)
    {
        $plainte = Plainte::findOrFail($id);

        $validated = $request->validate([
            'statut' => 'sometimes|in:en_attente,en_cours,traite',
            'categorie' => 'sometimes|string',
            'resume' => 'sometimes|string',
        ]);

        $plainte->update($validated);

        return response()->json($plainte);
    }

    // Supprimer une plainte
    public function destroy(string $id)
    {
        $plainte = Plainte::findOrFail($id);
        $plainte->delete();

        return response()->json(['message' => 'Plainte supprimée']);
    }
}