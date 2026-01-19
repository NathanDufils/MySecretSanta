<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Wishlist;

class WishlistPolicy
{
    /**
     * Vérifie si l'utilisateur est propriétaire de la wishlist.
     */
    public function view(User $user, Wishlist $wishlist): bool
    {
        return $wishlist->user_id === $user->id;
    }

    /**
     * Vérifie si l'utilisateur peut modifier la wishlist (propriétaire uniquement).
     */
    public function update(User $user, Wishlist $wishlist): bool
    {
        return $wishlist->user_id === $user->id;
    }

    /**
     * Vérifie si l'utilisateur peut supprimer la wishlist (propriétaire uniquement).
     */
    public function delete(User $user, Wishlist $wishlist): bool
    {
        return $wishlist->user_id === $user->id;
    }

    /**
     * Vérifie si l'utilisateur peut ajouter des items (propriétaire uniquement).
     */
    public function addItem(User $user, Wishlist $wishlist): bool
    {
        return $wishlist->user_id === $user->id;
    }

    /**
     * Vérifie si l'utilisateur peut supprimer des items (propriétaire uniquement).
     */
    public function removeItem(User $user, Wishlist $wishlist): bool
    {
        return $wishlist->user_id === $user->id;
    }
}
