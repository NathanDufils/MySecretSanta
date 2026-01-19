<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Invitation à rejoindre un groupe Secret Santa.
 *
 * @property int $id
 * @property int $group_id
 * @property string $email
 * @property string $token
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 *
 * @property-read Group $group
 */
class Invitation extends Model
{
    use HasFactory;

    protected $fillable = ['group_id', 'email', 'token'];

    /**
     * Le groupe auquel cette invitation se rapporte.
     */
    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }
}
