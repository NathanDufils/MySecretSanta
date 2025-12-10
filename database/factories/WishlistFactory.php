<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Wishlist>
 */
class WishlistFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->randomElement(['Ma liste de Noël', 'Anniversaire', 'Idées Tech', 'Livres']),
            'user_id' => User::factory(), // Lie la liste à un nouvel utilisateur par défaut
        ];
    }
}
