<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'max_budget', 'event_date', 'code', 'admin_id', 'status'];

    protected $casts = [
        'event_date' => 'date',
    ];

    // L'administrateur du groupe
    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    // Les participants
    public function participants()
    {
        return $this->belongsToMany(User::class)
                    ->withPivot('wishlist_id')
                    ->withTimestamps();
    }

    // Les résultats du tirage
    public function draws()
    {
        return $this->hasMany(Draw::class);
    }
}
