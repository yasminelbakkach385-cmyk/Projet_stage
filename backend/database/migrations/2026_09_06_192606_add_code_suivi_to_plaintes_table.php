<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('plaintes', function (Blueprint $table) {
            $table->string('code_suivi', 12)->nullable()->unique()->after('id');
        });
    }

    public function down(): void
    {
        Schema::table('plaintes', function (Blueprint $table) {
            $table->dropColumn('code_suivi');
        });
    }
};