<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Représente un tirage Secret Santa (qui offre à qui).
 *
 * @property int $id
 * @property int $group_id
 * @property int $santa_id
 * @property int $target_id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 *
 * @property-read Group $group
 * @property-read User $santa
 * @property-read User $target
 */
class Draw extends Model
{
    use HasFactory;

    protected $fillable = ['group_id', 'santa_id', 'target_id'];

    /**
     * Le groupe auquel appartient ce tirage.
     */
    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    /**
     * Le "Santa" qui offre le cadeau.
     */
    public function santa(): BelongsTo
    {
        return $this->belongsTo(User::class, 'santa_id');
    }

    /**
     * La personne qui reçoit le cadeau.
     */
    public function target(): BelongsTo
    {
        return $this->belongsTo(User::class, 'target_id');
    }
}
