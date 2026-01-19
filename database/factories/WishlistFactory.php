<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factory pour générer de fausses listes de souhaits.
 *
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Wishlist>
 */
class WishlistFactory extends Factory
{
    /**
     * Définition des données par défaut.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // Titre aléatoire (3 mots)
            'title' => $this->faker->words(3, true),

            // Lie la liste à un nouvel utilisateur par défaut
            'user_id' => User::factory(),
        ];
    }
}
