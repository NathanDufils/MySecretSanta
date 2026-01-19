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
        // Table des listes de souhaits
        Schema::create('wishlists', function (Blueprint $table) {
            $table->id(); // ID unique
            $table->string('title'); // Titre de la liste (ex: "Ma liste Gaming")
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Propriétaire de la liste
            $table->timestamps(); // Dates de création/modification
        });
    }

    /**
     * Annule les migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wishlists');
    }
};
