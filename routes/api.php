<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Game\RoomController;

Route::post('/rooms', [RoomController::class, 'create']);
Route::get('/rooms/{room}', [RoomController::class, 'show']);
Route::post('/rooms/{room}/join', [RoomController::class, 'join']);
Route::post('/rooms/{room}/move', [RoomController::class, 'move']);
Route::post('/rooms/{room}/leave', [RoomController::class, 'leave']);
