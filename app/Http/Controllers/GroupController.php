<?php

namespace App\Http\Controllers;

use App\Models\Draw;
use App\Models\Group;
use App\Models\Invitation;
use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class GroupController extends Controller
{
    public function show(Group $group)
    {
        $this->authorize('view', $group);

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
            'userWishlists' => Auth::user()->wishlists()->with('items')->get(),
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
            'code' => Str::upper(Str::random(6)),
            'admin_id' => Auth::id(),
        ]);

        $group->participants()->attach(Auth::id());

        return redirect()->back();
    }

    public function update(Request $request, Group $group)
    {
        $this->authorize('update', $group);

        $validated = $request->validate([
            'description' => 'nullable|string|max:1000',
            'event_date' => 'required|date',
            'max_budget' => 'nullable|integer|min:0',
        ]);

        $group->update($validated);

        return redirect()->back();
    }

    public function addParticipant(Request $request, Group $group)
    {
        $this->authorize('addParticipant', $group);

        $validated = $request->validate([
            'email' => 'required|email',
        ]);

        // Check if already participant
        $existingUser = User::where('email', $validated['email'])->first();
        if ($existingUser && $group->participants->contains($existingUser->id)) {
            return redirect()->back()->withErrors(['email' => 'This user is already in the group.']);
        }

        // Check if already invited
        $existingInvitation = Invitation::where('group_id', $group->id)
            ->where('email', $validated['email'])
            ->first();

        if ($existingInvitation) {
            return redirect()->back()->withErrors(['email' => 'Invitation already sent to this email.']);
        }

        Invitation::create([
            'group_id' => $group->id,
            'email' => $validated['email'],
            'token' => Str::random(32),
        ]);

        return redirect()->back()->with('success', 'Invitation sent successfully.');
    }

    public function removeParticipant(Request $request, Group $group, User $user)
    {
        $this->authorize('removeParticipant', $group);

        if ($user->id === $group->admin_id) {
            return redirect()->back()->withErrors(['message' => 'Admin cannot leave the group this way.']);
        }

        $group->participants()->detach($user->id);

        return redirect()->back();
    }

    public function draw(Request $request, Group $group)
    {
        $this->authorize('draw', $group);

        // Improved Random Secret Santa Algorithm
        $participantIds = $group->participants->pluck('id')->toArray();
        $assignments = $this->generateRandomSecretSanta($participantIds);

        foreach ($assignments as $santaId => $targetId) {
            Draw::create([
                'group_id' => $group->id,
                'santa_id' => $santaId,
                'target_id' => $targetId,
            ]);
        }

        $group->update(['status' => 'drawn']);

        return redirect()->back();
    }

    /**
     * Generate a random Secret Santa assignment ensuring no one gets themselves
     * Uses a derangement algorithm with shuffling and validation
     */
    private function generateRandomSecretSanta(array $participantIds): array
    {
        $maxAttempts = 100;
        $count = count($participantIds);

        for ($attempt = 0; $attempt < $maxAttempts; $attempt++) {
            $santas = $participantIds;
            $targets = $participantIds;

            // Shuffle targets to create randomness
            shuffle($targets);

            $assignments = [];
            $valid = true;

            // Check if this shuffling creates a valid derangement (no one gets themselves)
            for ($i = 0; $i < $count; $i++) {
                if ($santas[$i] === $targets[$i]) {
                    $valid = false;
                    break;
                }
                $assignments[$santas[$i]] = $targets[$i];
            }

            if ($valid) {
                return $assignments;
            }
        }

        // Fallback: use circular shift method if random attempts fail
        $assignments = [];
        shuffle($participantIds);
        for ($i = 0; $i < $count; $i++) {
            $assignments[$participantIds[$i]] = $participantIds[($i + 1) % $count];
        }

        return $assignments;
    }

    public function assignWishlist(Request $request, Group $group)
    {
        $this->authorize('assignWishlist', $group);

        $validated = $request->validate([
            'wishlist_id' => 'nullable|exists:wishlists,id',
        ]);

        // Verify ownership if set
        if ($validated['wishlist_id']) {
            $wishlist = Wishlist::find($validated['wishlist_id']);
            if ($wishlist->user_id !== Auth::id()) {
                abort(403);
            }
        }

        $group->participants()->updateExistingPivot(Auth::id(), [
            'wishlist_id' => $validated['wishlist_id'],
        ]);

        return redirect()->back()->with('success', 'Wishlist assigned successfully.');
    }

    public function destroy(Group $group)
    {
        $this->authorize('delete', $group);

        $group->delete();

        return redirect('/')->with('success', 'Group deleted successfully.');
    }
}
