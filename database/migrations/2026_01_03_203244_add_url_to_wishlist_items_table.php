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
        Schema::table('wishlist_items', function (Blueprint $table) {
            // Ajout de la colonne URL pour le lien vers le produit
            $table->string('url')->nullable()->after('name');
        });
    }

    /**
     * Annule les migrations.
     */
    public function down(): void
    {
        Schema::table('wishlist_items', function (Blueprint $table) {
             $table->dropColumn('url');
        });
    }
};
