<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'groups' => Auth::user()?->groups ?? [],
        'invitations' => Auth::user()
            ? \App\Models\Invitation::where('email', Auth::user()->email)->with('group.admin')->get()
            : [],
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/groups/{group}', [\App\Http\Controllers\GroupController::class, 'show'])->name('groups.show');
    Route::post('/groups', [\App\Http\Controllers\GroupController::class, 'store'])->name('groups.store');
    Route::delete('/groups/{group}', [\App\Http\Controllers\GroupController::class, 'destroy'])->name('groups.destroy');

    Route::put('/groups/{group}', [\App\Http\Controllers\GroupController::class, 'update'])->name('groups.update');
    Route::post('/groups/{group}/participants', [\App\Http\Controllers\GroupController::class, 'addParticipant'])->name('groups.participants.add');
    Route::post('/invitations/{invitation}/accept', [\App\Http\Controllers\InvitationController::class, 'accept'])->name('invitations.accept');
    Route::post('/invitations/{invitation}/decline', [\App\Http\Controllers\InvitationController::class, 'decline'])->name('invitations.decline');

    Route::delete('/groups/{group}/participants/{user}', [\App\Http\Controllers\GroupController::class, 'removeParticipant'])->name('groups.participants.remove');
    Route::post('/groups/{group}/draw', [\App\Http\Controllers\GroupController::class, 'draw'])->name('groups.draw');
    Route::post('/groups/{group}/wishlist', [\App\Http\Controllers\GroupController::class, 'assignWishlist'])->name('groups.wishlist.assign');

    Route::resource('wishlists', \App\Http\Controllers\WishlistController::class);
    Route::post('/wishlists/{wishlist}/items', [\App\Http\Controllers\WishlistController::class, 'addItem'])->name('wishlists.items.add');
    Route::delete('/wishlists/{wishlist}/items/{item}', [\App\Http\Controllers\WishlistController::class, 'removeItem'])->name('wishlists.items.remove');
});

require __DIR__.'/settings.php';
