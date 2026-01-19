<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Exécute les migrations.
     */
    public function up(): void
    {
        // Table du cache
        Schema::create('cache', function (Blueprint $table) {
            $table->string('key')->primary(); // Clé unique du cache
            $table->mediumText('value'); // Valeur stockée
            $table->integer('expiration'); // Date d'expiration (timestamp)
        });

        // Table des verrous de cache (pour éviter les accès concurrents)
        Schema::create('cache_locks', function (Blueprint $table) {
            $table->string('key')->primary(); // Clé du verrou
            $table->string('owner'); // Propriétaire du verrou
            $table->integer('expiration'); // Expiration du verrou
        });
    }

    /**
     * Annule les migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cache');
        Schema::dropIfExists('cache_locks');
    }
};
