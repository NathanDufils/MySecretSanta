<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factory pour générer des faux groupes pour les tests.
 *
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Group>
 */
class GroupFactory extends Factory
{
    /**
     * Définition des données par défaut.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // Nom aléatoire de 3 mots (ex: "Noël Bureau 2025")
            'name' => $this->faker->words(3, true),

            // Description courte aléatoire
            'description' => $this->faker->sentence(),

            // Budget max entre 10 et 100
            'max_budget' => $this->faker->numberBetween(10, 100),

            // Date entre maintenant et +6 mois
            'event_date' => $this->faker->dateTimeBetween('now', '+6 months'),

            // Code unique : 2 lettres + 4 chiffres (ex: AB1234)
            'code' => $this->faker->unique()->bothify('??####'),

            // Statut par défaut
            'status' => 'open',

            // Crée un utilisateur admin associé
            'admin_id' => User::factory(), 
        ];
    }
}
