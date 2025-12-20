<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Draw extends Model
{
    use HasFactory;

    protected $fillable = ['group_id', 'santa_id', 'target_id'];

    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function santa()
    {
        return $this->belongsTo(User::class, 'santa_id');
    }

    public function target()
    {
        return $this->belongsTo(User::class, 'target_id');
    }
}
