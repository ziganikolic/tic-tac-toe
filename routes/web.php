<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/lobby', function () {
    return Inertia::render('Lobby');
})->name('lobby');

Route::get('/how-to', function () {
    return Inertia::render('HowToPlay');
})->name('how-to');

Route::get('/room/{room}', function (string $room) {
    return Inertia::render('Room', ['room' => $room]);
})->name('room');

Route::get('/settings/game', function () {
    return Inertia::render('Settings');
})->name('settings');

Route::get('/profile', function () {
    return Inertia::render('Profile');
})->name('profile');

Route::get('dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
