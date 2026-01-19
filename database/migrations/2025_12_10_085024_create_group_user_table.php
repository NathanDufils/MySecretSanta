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
        // Table pivot pour la relation Many-to-Many entre Users et Groups
        Schema::create('group_user', function (Blueprint $table) {
            $table->id(); // ID unique
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // ID utilisateur
            $table->foreignId('group_id')->constrained()->onDelete('cascade'); // ID groupe
            
            // Wishlist choisie par l'utilisateur pour ce groupe (optionnel au début)
            $table->foreignId('wishlist_id')->nullable()->constrained()->onDelete('set null');
            
            $table->timestamps(); // Dates de création/modification
            
            // Un utilisateur ne peut être dans un groupe qu'une seule fois
            $table->unique(['user_id', 'group_id']); 
        });
    }

    /**
     * Annule les migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('group_user');
    }
};
