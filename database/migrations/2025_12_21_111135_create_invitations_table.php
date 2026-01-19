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
        // Table des invitations
        Schema::create('invitations', function (Blueprint $table) {
            $table->id(); // ID unique
            $table->foreignId('group_id')->constrained()->onDelete('cascade'); // Groupe invitant
            $table->string('email'); // Email de l'invité
            $table->string('token')->unique(); // Token unique pour l'invitation
            $table->timestamps(); // Dates de création/modification
        });
    }

    /**
     * Annule les migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invitations');
    }
};
