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
        // Table des utilisateurs
        Schema::create('users', function (Blueprint $table) {
            $table->id(); // ID unique
            $table->string('name'); // Nom de l'utilisateur
            $table->string('email')->unique(); // Email unique
            $table->timestamp('email_verified_at')->nullable(); // Date de vérification de l'email
            $table->string('password'); // Mot de passe crypté
            $table->rememberToken(); // Token de "Se souvenir de moi"
            $table->timestamps(); // Champs created_at et updated_at
        });

        // Table des tokens de réinitialisation de mot de passe
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary(); // Email de l'utilisateur
            $table->string('token'); // Token de réinitialisation
            $table->timestamp('created_at')->nullable(); // Date de création
        });

        // Table des sessions (pour le stockage en base de données)
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary(); // ID de session
            $table->foreignId('user_id')->nullable()->index(); // ID de l'utilisateur associé
            $table->string('ip_address', 45)->nullable(); // Adresse IP
            $table->text('user_agent')->nullable(); // User agent (navigateur)
            $table->longText('payload'); // Données de session
            $table->integer('last_activity')->index(); // Dernière activité
        });
    }

    /**
     * Annule les migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
