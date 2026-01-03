<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WishlistController extends Controller
{

    public function index()
    {
        $wishlists = Auth::user()->wishlists()->with('items')->get();
        return Inertia::render('Wishlists/Index', [
            'wishlists' => $wishlists
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        Auth::user()->wishlists()->create($validated);

        return redirect()->back();
    }

    public function destroy(Wishlist $wishlist)
    {
        if ($wishlist->user_id !== Auth::id()) {
            abort(403);
        }

        $wishlist->delete();

        return redirect()->back();
    }

    public function addItem(Request $request, Wishlist $wishlist)
    {
        if ($wishlist->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'nullable|url|max:2048',
            'description' => 'nullable|string|max:1000',
        ]);

        $wishlist->items()->create($validated);

        return redirect()->back();
    }

    public function removeItem(Wishlist $wishlist, \App\Models\WishlistItem $item)
    {
        if ($wishlist->user_id !== Auth::id()) {
            abort(403);
        }

        if ($item->wishlist_id !== $wishlist->id) {
            abort(403);
        }

        $item->delete();

        return redirect()->back();
    }

}
