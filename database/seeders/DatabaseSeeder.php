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
     * Exécute les seeds de la base de données.
     */
    public function run(): void
    {
        // 1. Création de l'administrateur principal
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
        ]);

        // 2. Création d'un groupe géré par l'admin
        $group = Group::factory()->create([
            'name' => 'Noël des Devs',
            'admin_id' => $admin->id,
        ]);

        // 3. Création de 5 autres participants
        $participants = User::factory(5)->create();

        // 4. Création de la liste de souhaits de l'admin (avec 3 cadeaux)
        $adminWishlist = Wishlist::factory()
            ->has(WishlistItem::factory()->count(3), 'items')
            ->create(['user_id' => $admin->id]);

        // 5. Ajout de l'admin comme participant du groupe (avec sa liste)
        $group->participants()->attach($admin->id, [
            'wishlist_id' => $adminWishlist->id,
        ]);

        // 6. Pour chaque participant : création de liste + ajout au groupe
        foreach ($participants as $user) {
            $wishlist = Wishlist::factory()
                ->has(WishlistItem::factory()->count(3), 'items')
                ->create(['user_id' => $user->id]);

            $group->participants()->attach($user->id, [
                'wishlist_id' => $wishlist->id
            ]);
        }
    }
}
