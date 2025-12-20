<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'event_date', 'code', 'status', 'admin_id'];

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    public function participants()
    {
        return $this->belongsToMany(User::class, 'group_user')
            ->withPivot('wishlist_id')
            ->withTimestamps();
    }
}
