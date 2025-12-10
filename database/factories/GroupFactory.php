<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Group>
 */
class GroupFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true), // Ex: "Noël Bureau 2025"
            'description' => $this->faker->sentence(),
            'max_budget' => $this->faker->numberBetween(10, 100), // Budget entre 10 et 100
            'event_date' => $this->faker->dateTimeBetween('now', '+6 months'),
            'code' => $this->faker->unique()->bothify('??####'), // Ex: AB1234
            'status' => 'open',
            // Crée automatiquement un user admin si aucun n'est fourni
            'admin_id' => User::factory(), 
        ];
    }
}
