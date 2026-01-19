<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use App\Models\WishlistItem;
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
        $this->authorize('delete', $wishlist);

        $wishlist->delete();

        return redirect()->back();
    }

    public function addItem(Request $request, Wishlist $wishlist)
    {
        $this->authorize('addItem', $wishlist);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'nullable|url|max:2048',
            'description' => 'nullable|string|max:1000',
        ]);

        $wishlist->items()->create($validated);

        return redirect()->back();
    }

    public function removeItem(Wishlist $wishlist, WishlistItem $item)
    {
        $this->authorize('removeItem', $wishlist);

        if ($item->wishlist_id !== $wishlist->id) {
            abort(403);
        }

        $item->delete();

        return redirect()->back();
    }
}
