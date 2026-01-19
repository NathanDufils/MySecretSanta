<?php

namespace App\Http\Controllers;

use App\Models\Invitation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Laravel\Fortify\Features;

class WelcomeController extends Controller
{
    public function index()
    {
        return Inertia::render('Welcome', [
            'canRegister' => Features::enabled(Features::registration()),
            'groups' => Auth::user()?->groups ?? [],
            'invitations' => Auth::user()
                ? Invitation::where('email', Auth::user()->email)->with('group.admin')->get()
                : [],
        ]);
    }
}
