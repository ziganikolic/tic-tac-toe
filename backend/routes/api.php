<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoomController;

Route::post('/rooms', [RoomController::class, 'create']);
Route::get('/rooms/{roomId}', [RoomController::class, 'get']);
Route::post('/rooms/{roomId}/join', [RoomController::class, 'join']);
Route::post('/rooms/{roomId}/move', [RoomController::class, 'move']);
Route::post('/rooms/{roomId}/leave', [RoomController::class, 'leave']);
