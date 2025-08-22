<?php

use Illuminate\Support\Facades\Broadcast;

// Public channel - no auth required for testing
Broadcast::channel('room.{roomId}', function () {
    return true;
});
