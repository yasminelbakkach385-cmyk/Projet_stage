<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('plaintes', function (Blueprint $table) {
            $table->unsignedTinyInteger('note')->nullable()->after('statut');
            $table->text('commentaire_citoyen')->nullable()->after('note');
        });
    }

    public function down(): void
    {
        Schema::table('plaintes', function (Blueprint $table) {
            $table->dropColumn(['note', 'commentaire_citoyen']);
        });
    }
};