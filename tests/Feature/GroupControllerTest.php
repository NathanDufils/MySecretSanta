<?php

use App\Models\Draw;
use App\Models\Group;
use App\Models\Invitation;
use App\Models\User;
use App\Models\Wishlist;

beforeEach(function () {
    $this->admin = User::factory()->create();
    $this->user = User::factory()->create();
});

describe('GroupController', function () {

    describe('show', function () {

        it('affiche le groupe pour un participant', function () {
            $group = Group::factory()->create(['admin_id' => $this->admin->id]);
            $group->participants()->attach($this->admin->id);

            $response = $this->actingAs($this->admin)->get("/groups/{$group->id}");

            $response->assertStatus(200);
            $response->assertInertia(fn ($page) => $page
                ->component('Groups/Show')
                ->has('group')
                ->has('participants')
            );
        });

        it('refuse l\'accès à un non-participant', function () {
            $group = Group::factory()->create(['admin_id' => $this->admin->id]);
            $group->participants()->attach($this->admin->id);

            $response = $this->actingAs($this->user)->get("/groups/{$group->id}");

            $response->assertStatus(403);
        });

    });

    describe('store', function () {

        it('crée un nouveau groupe', function () {
            $response = $this->actingAs($this->admin)->post('/groups', [
                'name' => 'Famille Noël 2026',
            ]);

            $response->assertRedirect();
            
            $this->assertDatabaseHas('groups', [
                'name' => 'Famille Noël 2026',
                'admin_id' => $this->admin->id,
                'status' => 'open',
            ]);
        });

        it('ajoute automatiquement le créateur comme participant', function () {
            $this->actingAs($this->admin)->post('/groups', [
                'name' => 'Test Group',
            ]);

            $group = Group::where('name', 'Test Group')->first();
            
            expect($group->participants)->toHaveCount(1);
            expect($group->participants->first()->id)->toBe($this->admin->id);
        });

        it('génère un code unique de 6 caractères', function () {
            $this->actingAs($this->admin)->post('/groups', [
                'name' => 'Test Group',
            ]);

            $group = Group::where('name', 'Test Group')->first();
            
            expect(strlen($group->code))->toBe(6);
            expect($group->code)->toMatch('/^[A-Z0-9]+$/');
        });

    });

    describe('update', function () {

        it('permet à l\'admin de modifier le groupe', function () {
            $group = Group::factory()->create(['admin_id' => $this->admin->id]);
            $group->participants()->attach($this->admin->id);

            $response = $this->actingAs($this->admin)->put("/groups/{$group->id}", [
                'description' => 'Nouvelle description',
                'event_date' => '2026-12-25',
                'max_budget' => 50,
            ]);

            $response->assertRedirect();
            
            $group->refresh();
            expect($group->description)->toBe('Nouvelle description');
            expect($group->max_budget)->toBe(50);
        });

        it('refuse la modification par un non-admin', function () {
            $group = Group::factory()->create(['admin_id' => $this->admin->id]);
            $group->participants()->attach([$this->admin->id, $this->user->id]);

            $response = $this->actingAs($this->user)->put("/groups/{$group->id}", [
                'description' => 'Tentative',
                'event_date' => '2026-12-25',
            ]);

            $response->assertStatus(403);
        });

    });

    describe('addParticipant', function () {

        it('envoie une invitation par email', function () {
            $group = Group::factory()->create(['admin_id' => $this->admin->id, 'status' => 'open']);
            $group->participants()->attach($this->admin->id);

            $response = $this->actingAs($this->admin)->post("/groups/{$group->id}/participants", [
                'email' => 'nouveau@example.com',
            ]);

            $response->assertRedirect();
            
            $this->assertDatabaseHas('invitations', [
                'group_id' => $group->id,
                'email' => 'nouveau@example.com',
            ]);
        });

        it('refuse les invitations en double', function () {
            $group = Group::factory()->create(['admin_id' => $this->admin->id, 'status' => 'open']);
            $group->participants()->attach($this->admin->id);
            
            Invitation::create([
                'group_id' => $group->id,
                'email' => 'deja@invité.com',
                'token' => 'token123',
            ]);

            $response = $this->actingAs($this->admin)->post("/groups/{$group->id}/participants", [
                'email' => 'deja@invité.com',
            ]);

            $response->assertSessionHasErrors('email');
        });

        it('refuse si le groupe est déjà tiré', function () {
            $group = Group::factory()->create(['admin_id' => $this->admin->id, 'status' => 'drawn']);
            $group->participants()->attach($this->admin->id);

            $response = $this->actingAs($this->admin)->post("/groups/{$group->id}/participants", [
                'email' => 'test@example.com',
            ]);

            $response->assertStatus(403);
        });

    });

    describe('draw', function () {

        it('effectue le tirage au sort avec 3+ participants', function () {
            $group = Group::factory()->create(['admin_id' => $this->admin->id, 'status' => 'open']);
            $users = User::factory()->count(2)->create();
            $group->participants()->attach([$this->admin->id, $users[0]->id, $users[1]->id]);

            $response = $this->actingAs($this->admin)->post("/groups/{$group->id}/draw");

            $response->assertRedirect();
            
            $group->refresh();
            expect($group->status)->toBe('drawn');
            expect(Draw::where('group_id', $group->id)->count())->toBe(3);
        });

        it('refuse le tirage avec moins de 3 participants', function () {
            $group = Group::factory()->create(['admin_id' => $this->admin->id, 'status' => 'open']);
            $group->participants()->attach([$this->admin->id, $this->user->id]);

            $response = $this->actingAs($this->admin)->post("/groups/{$group->id}/draw");

            $response->assertStatus(403);
        });

        it('refuse le tirage par un non-admin', function () {
            $group = Group::factory()->create(['admin_id' => $this->admin->id, 'status' => 'open']);
            $users = User::factory()->count(2)->create();
            $group->participants()->attach([$this->admin->id, $this->user->id, $users[0]->id]);

            $response = $this->actingAs($this->user)->post("/groups/{$group->id}/draw");

            $response->assertStatus(403);
        });

    });

    describe('destroy', function () {

        it('permet à l\'admin de supprimer le groupe', function () {
            $group = Group::factory()->create(['admin_id' => $this->admin->id]);
            $group->participants()->attach($this->admin->id);

            $response = $this->actingAs($this->admin)->delete("/groups/{$group->id}");

            $response->assertRedirect('/');
            $this->assertDatabaseMissing('groups', ['id' => $group->id]);
        });

        it('refuse la suppression par un non-admin', function () {
            $group = Group::factory()->create(['admin_id' => $this->admin->id]);
            $group->participants()->attach([$this->admin->id, $this->user->id]);

            $response = $this->actingAs($this->user)->delete("/groups/{$group->id}");

            $response->assertStatus(403);
            $this->assertDatabaseHas('groups', ['id' => $group->id]);
        });

    });

    describe('assignWishlist', function () {

        it('permet à un participant d\'assigner sa wishlist', function () {
            $group = Group::factory()->create(['admin_id' => $this->admin->id]);
            $group->participants()->attach($this->user->id);
            
            $wishlist = Wishlist::factory()->create(['user_id' => $this->user->id]);

            $response = $this->actingAs($this->user)->post("/groups/{$group->id}/wishlist", [
                'wishlist_id' => $wishlist->id,
            ]);

            $response->assertRedirect();
            
            expect($group->participants()->find($this->user->id)->pivot->wishlist_id)->toBe($wishlist->id);
        });

        it('refuse d\'assigner la wishlist d\'un autre utilisateur', function () {
            $group = Group::factory()->create(['admin_id' => $this->admin->id]);
            $group->participants()->attach($this->user->id);
            
            $otherWishlist = Wishlist::factory()->create(['user_id' => $this->admin->id]);

            $response = $this->actingAs($this->user)->post("/groups/{$group->id}/wishlist", [
                'wishlist_id' => $otherWishlist->id,
            ]);

            $response->assertStatus(403);
        });

    });

});
