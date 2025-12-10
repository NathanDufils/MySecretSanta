<?php

namespace Database\Seeders;

use App\Models\Group;
use App\Models\User;
use App\Models\Wishlist;
use App\Models\WishlistItem;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Créer un admin principal (pour vous connecter)
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
        ]);

        // 2. Créer un groupe géré par cet admin
        $group = Group::factory()->create([
            'name' => 'Noël des Devs',
            'admin_id' => $admin->id,
        ]);

        // 3. Créer 5 participants
        $participants = User::factory(5)->create();

        foreach ($participants as $user) {
            // A. Pour chaque participant, on crée une Wishlist avec 3 cadeaux
            $wishlist = Wishlist::factory()
                ->has(WishlistItem::factory()->count(3), 'items') // Relation définie dans le modèle
                ->create(['user_id' => $user->id]);

            // B. On attache le participant au groupe EN LUI ASSIGNANT sa wishlist
            $group->participants()->attach($user->id, [
                'wishlist_id' => $wishlist->id // C'est ici qu'on remplit la colonne pivot !
            ]);
        }
    }
}
