<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Représente un groupe Secret Santa.
 *
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property \Carbon\Carbon $event_date
 * @property int|null $max_budget
 * @property string $code
 * @property string $status
 * @property int $admin_id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 *
 * @property-read User $admin
 * @property-read \Illuminate\Database\Eloquent\Collection<int, User> $participants
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Draw> $draws
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Invitation> $invitations
 */
class Group extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'event_date',
        'max_budget',
        'code',
        'status',
        'admin_id',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'event_date' => 'datetime',
            'max_budget' => 'integer',
        ];
    }

    /**
     * L'administrateur du groupe.
     */
    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    /**
     * Les participants du groupe.
     */
    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'group_user')
            ->withPivot('wishlist_id')
            ->withTimestamps();
    }

    /**
     * Les tirages au sort effectués dans ce groupe.
     */
    public function draws(): HasMany
    {
        return $this->hasMany(Draw::class);
    }

    /**
     * Les invitations en attente pour ce groupe.
     */
    public function invitations(): HasMany
    {
        return $this->hasMany(Invitation::class);
    }
}
