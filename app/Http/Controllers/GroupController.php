<?php

namespace App\Http\Controllers;

use App\Models\Draw;
use App\Models\Group;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GroupController extends Controller
{
    public function show(Group $group)
    {
        // Ensure user belongs to the group
        if (!$group->participants->contains(Auth::id())) {
            abort(403);
        }

        // Load participants
        $participants = $group->participants;
        
        // Manually load wishlists to ensure we get the specific one assigned to this group
        // avoiding N+1 cleanly by collecting IDs first
        $wishlistIds = $participants->pluck('pivot.wishlist_id')->filter();
        $wishlists = Wishlist::whereIn('id', $wishlistIds)->with('items')->get()->keyBy('id');

        $participants->transform(function ($participant) use ($wishlists) {
            $wishlistId = $participant->pivot->wishlist_id;
            $participant->assigned_wishlist = $wishlistId ? $wishlists->get($wishlistId) : null;
            return $participant;
        });

        // Get the Mission (Target)
        $draw = Draw::where('group_id', $group->id)
            ->where('santa_id', Auth::id())
            ->with('target')
            ->first();

        return Inertia::render('Groups/Show', [
            'group' => $group,
            'participants' => $participants,
            'draw' => $draw,
        ]);
    }
}
