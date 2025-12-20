<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'groups' => Auth::user()?->groups ?? [],
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/groups/{group}', [\App\Http\Controllers\GroupController::class, 'show'])->name('groups.show');
    Route::post('/groups', [\App\Http\Controllers\GroupController::class, 'store'])->name('groups.store');
    
    Route::put('/groups/{group}', [\App\Http\Controllers\GroupController::class, 'update'])->name('groups.update');
    Route::post('/groups/{group}/participants', [\App\Http\Controllers\GroupController::class, 'addParticipant'])->name('groups.participants.add');
    Route::delete('/groups/{group}/participants/{user}', [\App\Http\Controllers\GroupController::class, 'removeParticipant'])->name('groups.participants.remove');
    Route::post('/groups/{group}/draw', [\App\Http\Controllers\GroupController::class, 'draw'])->name('groups.draw');
});

require __DIR__.'/settings.php';
