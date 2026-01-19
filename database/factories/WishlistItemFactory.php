<?php

namespace Database\Factories;

use App\Models\Wishlist;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factory pour générer de faux articles de liste de souhaits.
 *
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\WishlistItem>
 */
class WishlistItemFactory extends Factory
{
    /**
     * Définition des données par défaut.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // Associe l'article à une liste de souhaits existante ou nouvelle
            'wishlist_id' => Wishlist::factory(),

            // Nom de l'objet (2-3 mots, ex: "Casque Audio")
            'name' => $this->faker->words(3, true),

            // Description ou détails supplémentaires
            'description' => $this->faker->sentence(),
        ];
    }
}
