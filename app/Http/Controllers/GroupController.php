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
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Calculate next Christmas
        $now = now();
        $christmas = \Carbon\Carbon::create($now->year, 12, 25);
        
        if ($now->greaterThanOrEqualTo($christmas)) {
            $christmas->addYear();
        }

        $group = Group::create([
            'name' => $validated['name'],
            'event_date' => $christmas,
            'code' => \Illuminate\Support\Str::upper(\Illuminate\Support\Str::random(6)),
            'admin_id' => Auth::id(),
        ]);

        $group->participants()->attach(Auth::id());

        return redirect()->back();
    }

    public function update(Request $request, Group $group)
    {
        if ($group->admin_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'description' => 'nullable|string|max:1000',
            'event_date' => 'required|date',
        ]);

        $group->update($validated);

        return redirect()->back();
    }

    public function addParticipant(Request $request, Group $group)
    {
        if ($group->admin_id !== Auth::id()) {
            abort(403);
        }

        if ($group->status !== 'open') {
            return redirect()->back()->withErrors(['message' => 'Cannot add members after draw.']);
        }

        $validated = $request->validate([
            'email' => 'required|email',
        ]);

        // Check if already participant
        $existingUser = \App\Models\User::where('email', $validated['email'])->first();
        if ($existingUser && $group->participants->contains($existingUser->id)) {
             return redirect()->back()->withErrors(['email' => 'This user is already in the group.']);
        }

        // Check if already invited
        $existingInvitation = \App\Models\Invitation::where('group_id', $group->id)
            ->where('email', $validated['email'])
            ->first();

        if ($existingInvitation) {
            return redirect()->back()->withErrors(['email' => 'Invitation already sent to this email.']);
        }

        \App\Models\Invitation::create([
            'group_id' => $group->id,
            'email' => $validated['email'],
            'token' => \Illuminate\Support\Str::random(32),
        ]);

        return redirect()->back()->with('success', 'Invitation sent successfully.');
    }

    public function removeParticipant(Request $request, Group $group, \App\Models\User $user)
    {
        if ($group->admin_id !== Auth::id()) {
            abort(403);
        }

        if ($group->status !== 'open') {
            return redirect()->back()->withErrors(['message' => 'Cannot remove members after draw.']);
        }

        if ($user->id === $group->admin_id) {
             return redirect()->back()->withErrors(['message' => 'Admin cannot leave the group this way.']);
        }

        $group->participants()->detach($user->id);

        return redirect()->back();
    }

    public function draw(Request $request, Group $group)
    {
        if ($group->admin_id !== Auth::id()) {
            abort(403);
        }

        if ($group->participants()->count() < 3) {
            return redirect()->back()->withErrors(['message' => 'Need at least 3 participants.']);
        }

        if ($group->status !== 'open') {
            return redirect()->back()->withErrors(['message' => 'Draw already happened.']);
        }

        // Simple Secret Santa Algorithm
        $participants = $group->participants->pluck('id')->shuffle();
        $count = $participants->count();

        for ($i = 0; $i < $count; $i++) {
            $santaId = $participants[$i];
            $targetId = $participants[($i + 1) % $count];

            Draw::create([
                'group_id' => $group->id,
                'santa_id' => $santaId,
                'target_id' => $targetId,
            ]);
        }

        $group->update(['status' => 'drawn']);

        return redirect()->back();
    }
}
