<?php

namespace App\Services;

/**
 * Service responsable de la génération des tirages Secret Santa.
 * 
 * Utilise un algorithme de dérangement (derangement) pour s'assurer
 * qu'aucun participant ne se tire lui-même.
 */
class SecretSantaDrawService
{
    /**
     * Génère les assignations Secret Santa pour une liste de participants.
     *
     * Utilise une méthode simple et infaillible :
     * 1. Mélange les participants.
     * 2. Chaque participant offre à celui qui le suit dans la liste mélangée.
     * 3. Le dernier offre au premier.
     *
     * @param array<int> $participantIds Liste des IDs des participants
     * @return array<int, int> Tableau associatif [santa_id => target_id]
     */
    public function generateAssignments(array $participantIds): array
    {
        $count = count($participantIds);

        if ($count < 2) {
            throw new \InvalidArgumentException('Il faut au moins 2 participants pour un tirage.');
        }

        // 1. Mélange aléatoire des participants
        shuffle($participantIds);

        // 2. Assignation circulaire
        $assignments = [];
        for ($i = 0; $i < $count; $i++) {
            // L'utilisateur courant offre au suivant (modulo pour boucler à la fin)
            $santaId = $participantIds[$i];
            $targetId = $participantIds[($i + 1) % $count];
            
            $assignments[$santaId] = $targetId;
        }

        return $assignments;
    }
}
