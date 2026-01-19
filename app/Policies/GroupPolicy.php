<?php

namespace App\Policies;

use App\Models\Group;
use App\Models\User;

class GroupPolicy
{
    /**
     * Vérifie si l'utilisateur est membre du groupe.
     */
    public function view(User $user, Group $group): bool
    {
        return $group->participants->contains($user->id);
    }

    /**
     * Vérifie si l'utilisateur est l'administrateur du groupe.
     */
    public function update(User $user, Group $group): bool
    {
        return $group->admin_id === $user->id;
    }

    /**
     * Vérifie si l'utilisateur peut supprimer le groupe (admin uniquement).
     */
    public function delete(User $user, Group $group): bool
    {
        return $group->admin_id === $user->id;
    }

    /**
     * Vérifie si l'utilisateur peut ajouter des participants (admin + groupe ouvert).
     */
    public function addParticipant(User $user, Group $group): bool
    {
        return $group->admin_id === $user->id && $group->status === 'open';
    }

    /**
     * Vérifie si l'utilisateur peut retirer des participants (admin + groupe ouvert).
     */
    public function removeParticipant(User $user, Group $group): bool
    {
        return $group->admin_id === $user->id && $group->status === 'open';
    }

    /**
     * Vérifie si l'utilisateur peut lancer le tirage (admin + groupe ouvert + min 3 participants).
     */
    public function draw(User $user, Group $group): bool
    {
        return $group->admin_id === $user->id 
            && $group->status === 'open'
            && $group->participants()->count() >= 3;
    }

    /**
     * Vérifie si l'utilisateur peut assigner sa wishlist (membre du groupe).
     */
    public function assignWishlist(User $user, Group $group): bool
    {
        return $group->participants->contains($user->id);
    }
}
