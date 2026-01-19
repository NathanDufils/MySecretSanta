<?php

namespace App\Http\Controllers;

use App\Models\Invitation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class InvitationController extends Controller
{
    public function accept(Request $request, Invitation $invitation)
    {
        $this->authorize('accept', $invitation);

        $invitation->group->participants()->attach(Auth::id());
        $invitation->delete();

        return redirect()->back()->with('success', 'Invitation accepted! You have joined the group.');
    }

    public function decline(Request $request, Invitation $invitation)
    {
        $this->authorize('decline', $invitation);

        $invitation->delete();

        return redirect()->back()->with('success', 'Invitation declined.');
    }
}
