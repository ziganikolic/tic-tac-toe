<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Game\RoomController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/rooms/{room}', [RoomController::class, 'show']);
    Route::post('/rooms/{room}/moves', [RoomController::class, 'storeMove']);
});
