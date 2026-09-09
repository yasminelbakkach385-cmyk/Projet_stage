<?php

namespace App\Http\Controllers;

use App\Models\Annonce;
use Illuminate\Http\Request;

class AnnonceController extends Controller
{
    public function index()
    {
        return Annonce::orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $valide = $request->validate([
            'titre' => 'required|string|max:255',
            'contenu' => 'required|string',
        ]);

        $valide['user_id'] = $request->user()?->id;

        $annonce = Annonce::create($valide);

        return response()->json($annonce, 201);
    }

    public function show($id)
    {
        $annonce = Annonce::find($id);

        if (!$annonce) {
            return response()->json(['message' => 'Annonce introuvable'], 404);
        }

        return $annonce;
    }

    public function destroy($id)
    {
        $annonce = Annonce::find($id);

        if (!$annonce) {
            return response()->json(['message' => 'Annonce introuvable'], 404);
        }

        $annonce->delete();

        return response()->json(['message' => 'Annonce supprimée']);
    }
}