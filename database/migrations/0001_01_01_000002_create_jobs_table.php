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
        // Table des jobs (files d'attente)
        Schema::create('jobs', function (Blueprint $table) {
            $table->id(); // ID unique du job
            $table->string('queue')->index(); // Nom de la file d'attente
            $table->longText('payload'); // Données du job
            $table->unsignedTinyInteger('attempts'); // Nombre de tentatives
            $table->unsignedInteger('reserved_at')->nullable(); // Date de réservation (traitement en cours)
            $table->unsignedInteger('available_at'); // Date de disponibilité
            $table->unsignedInteger('created_at'); // Date de création
        });

        // Table des lots de jobs (batches)
        Schema::create('job_batches', function (Blueprint $table) {
            $table->string('id')->primary(); // ID du lot
            $table->string('name'); // Nom du lot
            $table->integer('total_jobs'); // Nombre total de jobs
            $table->integer('pending_jobs'); // Jobs en attente
            $table->integer('failed_jobs'); // Jobs échoués
            $table->longText('failed_job_ids'); // IDs des jobs échoués
            $table->mediumText('options')->nullable(); // Options du lot
            $table->integer('cancelled_at')->nullable(); // Date d'annulation
            $table->integer('created_at'); // Date de création
            $table->integer('finished_at')->nullable(); // Date de fin
        });

        // Table des jobs échoués
        Schema::create('failed_jobs', function (Blueprint $table) {
            $table->id(); // ID unique
            $table->string('uuid')->unique(); // UUID unique
            $table->text('connection'); // Connexion utilisée
            $table->text('queue'); // File d'attente concernée
            $table->longText('payload'); // Données du job
            $table->longText('exception'); // Exception levée (erreur)
            $table->timestamp('failed_at')->useCurrent(); // Date de l'échec
        });
    }

    /**
     * Annule les migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jobs');
        Schema::dropIfExists('job_batches');
        Schema::dropIfExists('failed_jobs');
    }
};
