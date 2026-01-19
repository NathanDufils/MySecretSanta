<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Article d'une liste de souhaits.
 *
 * @property int $id
 * @property int $wishlist_id
 * @property string $name
 * @property string|null $url
 * @property string|null $description
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 *
 * @property-read Wishlist $wishlist
 */
class WishlistItem extends Model
{
    use HasFactory;

    protected $fillable = ['wishlist_id', 'name', 'url', 'description'];

    /**
     * La wishlist à laquelle appartient cet article.
     */
    public function wishlist(): BelongsTo
    {
        return $this->belongsTo(Wishlist::class);
    }
}
