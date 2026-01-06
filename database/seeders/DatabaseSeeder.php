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
        // 1. Create a main admin (for you to log in)
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
        ]);

        // 2. Create a group managed by this admin
        $group = Group::factory()->create([
            'name' => 'Noël des Devs',
            'admin_id' => $admin->id,
        ]);

        // 3. Create 5 other participants
        $participants = User::factory(5)->create();

        // 4. Create a Wishlist for the Admin with 3 gifts
        $adminWishlist = Wishlist::factory()
            ->has(WishlistItem::factory()->count(3), 'items')
            ->create(['user_id' => $admin->id]);

        // 5. Attach Admin to the group as a participant with their wishlist
        $group->participants()->attach($admin->id, [
            'wishlist_id' => $adminWishlist->id,
        ]);

        // 6. Loop through other participants to create wishlists and attach them
        foreach ($participants as $user) {
            $wishlist = Wishlist::factory()
                ->has(WishlistItem::factory()->count(3), 'items')
                ->create(['user_id' => $user->id]);

            $group->participants()->attach($user->id, [
                'wishlist_id' => $wishlist->id
            ]);
        }

        // 7. Organize the Secret Santa Draw
        // Collect all group members (Admin + Participants)
        // $allParticipants = $group->participants()->get();

        // Simple algorithm to shuffle and assign
        // We shuffle the collection and link item N to N+1, and Last to First.
        // $shuffled = $allParticipants->shuffle();

        // $count = $shuffled->count();
        // if ($count < 2) {
        //     return; // Not enough people for a draw
        // }

        // for ($i = 0; $i < $count; $i++) {
        //     $santa = $shuffled[$i];
        //     // If it's the last person, they give to the first person
        //     $target = ($i === $count - 1) ? $shuffled[0] : $shuffled[$i + 1];

        //     \App\Models\Draw::create([
        //         'group_id' => $group->id,
        //         'santa_id' => $santa->id,
        //         'target_id' => $target->id,
        //     ]);
        // }
    }
}
