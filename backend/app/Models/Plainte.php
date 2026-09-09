<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Plainte extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'code_suivi',
        'titre',
        'description',
        'categorie',
        'resume',
        'statut',
        'urgent',
        'quartier',
        'telephone',
        'note',
        'commentaire_citoyen',
        'image',
        'photo',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($plainte) {
            do {
                $code = 'FN-' . strtoupper(Str::random(6));
            } while (self::where('code_suivi', $code)->exists());

            $plainte->code_suivi = $code;
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}