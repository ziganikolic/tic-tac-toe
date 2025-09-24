<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('room.{roomId}', function ($user, $roomId) {
    // TODO: authorize presence channel
    return ['id' => $user->id, 'name' => $user->name];
});
