<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    /**
     * Exécute les migrations.
     */
    public function up(): void
    {
        // Table des tirages au sort
        Schema::create('draws', function (Blueprint $table) {
            $table->id(); // ID unique
            $table->foreignId('group_id')->constrained()->onDelete('cascade'); // Groupe associé
            $table->foreignId('santa_id')->constrained('users')->onDelete('cascade'); // Celui qui offre (Santa)
            $table->foreignId('target_id')->constrained('users')->onDelete('cascade'); // Celui qui reçoit
            $table->timestamps(); // Dates de création/modification
        });
    }

    /**
     * Annule les migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('draws');
    }
};
