<?php

use App\Services\SecretSantaDrawService;

beforeEach(function () {
    $this->service = new SecretSantaDrawService();
});

describe('SecretSantaDrawService', function () {

    it('génère des assignations valides pour 3 participants', function () {
        $participants = [1, 2, 3];
        
        $assignments = $this->service->generateAssignments($participants);
        
        expect($assignments)->toHaveCount(3);
        expect(array_keys($assignments))->toEqualCanonicalizing($participants);
        expect(array_values($assignments))->toEqualCanonicalizing($participants);
        
        // Vérifie que personne ne se tire soi-même
        foreach ($assignments as $santa => $target) {
            expect($santa)->not->toBe($target);
        }
    });

    it('génère des assignations valides pour 10 participants', function () {
        $participants = range(1, 10);
        
        $assignments = $this->service->generateAssignments($participants);
        
        expect($assignments)->toHaveCount(10);
        
        // Vérifie que personne ne se tire soi-même
        foreach ($assignments as $santa => $target) {
            expect($santa)->not->toBe($target);
        }
        
        // Vérifie que chaque participant est assigné exactement une fois
        expect(array_values($assignments))->toEqualCanonicalizing($participants);
    });

    it('génère des assignations valides pour 2 participants (cas limite)', function () {
        $participants = [1, 2];
        
        $assignments = $this->service->generateAssignments($participants);
        
        expect($assignments)->toHaveCount(2);
        
        // Avec 2 participants, ils doivent s'échanger mutuellement
        expect($assignments[1])->toBe(2);
        expect($assignments[2])->toBe(1);
    });

    it('lève une exception avec moins de 2 participants', function () {
        $participants = [1];
        
        expect(fn () => $this->service->generateAssignments($participants))
            ->toThrow(\InvalidArgumentException::class, 'Il faut au moins 2 participants pour un tirage.');
    });

    it('lève une exception avec un tableau vide', function () {
        expect(fn () => $this->service->generateAssignments([]))
            ->toThrow(\InvalidArgumentException::class);
    });

    it('produit des résultats aléatoires sur plusieurs exécutions', function () {
        $participants = range(1, 5);
        $results = [];
        
        // Exécute 10 fois et vérifie qu'on obtient au moins 2 résultats différents
        for ($i = 0; $i < 10; $i++) {
            $assignments = $this->service->generateAssignments($participants);
            $results[] = json_encode($assignments);
        }
        
        $uniqueResults = array_unique($results);
        
        // On devrait avoir plusieurs résultats différents (probabilité très élevée)
        expect(count($uniqueResults))->toBeGreaterThan(1);
    });

    it('gère correctement un grand nombre de participants', function () {
        $participants = range(1, 100);
        
        $assignments = $this->service->generateAssignments($participants);
        
        expect($assignments)->toHaveCount(100);
        
        // Vérifie que personne ne se tire soi-même
        foreach ($assignments as $santa => $target) {
            expect($santa)->not->toBe($target);
        }
    });

});
