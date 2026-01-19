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
        // Table des groupes
        Schema::create('groups', function (Blueprint $table) {
            $table->id(); // ID unique
            $table->string('name'); // Nom du groupe
            $table->text('description')->nullable(); // Description optionnelle
            $table->integer('max_budget')->nullable(); // Budget max (centimes ou devise)
            $table->date('event_date'); // Date de l'événement
            $table->string('code')->unique(); // Code unique pour rejoindre
            $table->string('status')->default('open'); // Statut: 'open' ou 'drawn'
            
            // ID de l'administrateur du groupe
            $table->foreignId('admin_id')->constrained('users')->onDelete('cascade');
            
            $table->timestamps(); // Dates de création/modification
        });
    }

    /**
     * Annule les migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('groups');
    }
};
