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
        // Table des articles de la liste de souhaits
        Schema::create('wishlist_items', function (Blueprint $table) {
            $table->id(); // ID unique
            
            // Liste associée (suppression en cascade si la liste est supprimée)
            $table->foreignId('wishlist_id')->constrained()->onDelete('cascade');
            
            $table->string('name'); // Nom de l'article (ex: "Livre PHP")
            $table->text('description')->nullable(); // Description détaillée
            
            $table->timestamps(); // Dates de création/modification
        });
    }

    /**
     * Annule les migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wishlist_items');
    }
};
