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
     * Nombre maximum de tentatives pour générer un tirage valide.
     */
    private const MAX_ATTEMPTS = 100;

    /**
     * Génère les assignations Secret Santa pour une liste de participants.
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

        // Tentative de génération par mélange aléatoire
        $assignments = $this->tryRandomDerangement($participantIds, $count);

        if ($assignments !== null) {
            return $assignments;
        }

        // Fallback: méthode de rotation circulaire (garantie de fonctionner)
        return $this->circularShiftAssignment($participantIds, $count);
    }

    /**
     * Tente de générer un dérangement valide par mélange aléatoire.
     *
     * @param array<int> $participantIds
     * @param int $count
     * @return array<int, int>|null Retourne null si échec après MAX_ATTEMPTS
     */
    private function tryRandomDerangement(array $participantIds, int $count): ?array
    {
        for ($attempt = 0; $attempt < self::MAX_ATTEMPTS; $attempt++) {
            $santas = $participantIds;
            $targets = $participantIds;

            shuffle($targets);

            if ($this->isValidDerangement($santas, $targets, $count)) {
                return array_combine($santas, $targets);
            }
        }

        return null;
    }

    /**
     * Vérifie si le mélange produit un dérangement valide (personne ne se tire soi-même).
     *
     * @param array<int> $santas
     * @param array<int> $targets
     * @param int $count
     * @return bool
     */
    private function isValidDerangement(array $santas, array $targets, int $count): bool
    {
        for ($i = 0; $i < $count; $i++) {
            if ($santas[$i] === $targets[$i]) {
                return false;
            }
        }

        return true;
    }

    /**
     * Génère une assignation par rotation circulaire (fallback garanti).
     *
     * Chaque participant offre au suivant dans la liste mélangée.
     *
     * @param array<int> $participantIds
     * @param int $count
     * @return array<int, int>
     */
    private function circularShiftAssignment(array $participantIds, int $count): array
    {
        shuffle($participantIds);

        $assignments = [];
        for ($i = 0; $i < $count; $i++) {
            $assignments[$participantIds[$i]] = $participantIds[($i + 1) % $count];
        }

        return $assignments;
    }
}
