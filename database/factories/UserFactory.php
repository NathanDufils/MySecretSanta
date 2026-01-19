<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Factory pour générer de faux utilisateurs pour les tests.
 *
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Mot de passe actuel utilisé par la factory.
     */
    protected static ?string $password;

    /**
     * Définition des données par défaut.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // Nom complet aléatoire
            'name' => fake()->name(),

            // Email unique et valide
            'email' => fake()->unique()->safeEmail(),

            // Email vérifié immédiatement
            'email_verified_at' => now(),

            // Mot de passe (haché) : "password" par défaut
            'password' => static::$password ??= Hash::make('password'),

            // Jeton "Se souvenir de moi" aléatoire
            'remember_token' => Str::random(10),

            // Configuration 2FA factice
            'two_factor_secret' => Str::random(10),
            'two_factor_recovery_codes' => Str::random(10),
            'two_factor_confirmed_at' => now(),
        ];
    }

    /**
     * Indique que l'adresse email n'est pas vérifiée.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Indique que l'utilisateur n'a pas activé l'authentification à deux facteurs.
     */
    public function withoutTwoFactor(): static
    {
        return $this->state(fn (array $attributes) => [
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null,
        ]);
    }
}
