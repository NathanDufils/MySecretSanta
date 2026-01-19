<?php

namespace App\Policies;

use App\Models\Invitation;
use App\Models\User;

class InvitationPolicy
{
    /**
     * Vérifie si l'utilisateur peut accepter l'invitation (destinataire uniquement).
     */
    public function accept(User $user, Invitation $invitation): bool
    {
        return $invitation->email === $user->email;
    }

    /**
     * Vérifie si l'utilisateur peut refuser l'invitation (destinataire uniquement).
     */
    public function decline(User $user, Invitation $invitation): bool
    {
        return $invitation->email === $user->email;
    }
}
