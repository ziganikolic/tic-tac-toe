<?php

namespace App\Services;

use Illuminate\Support\Facades\Redis;
use App\Validators\MoveValidator;
use App\Events\StateSynced;

class GameStateService
{
    // TODO: methods getState, saveState, broadcastState
    public function getState(string $roomId): array|null
    {
        // TODO: fetch from Redis
        return null;
    }

    public function saveState(string $roomId, array $state): void
    {
        // TODO: save to Redis and broadcast StateSynced
    }

    public function applyMove(string $roomId, array $move, int $userId): array
    {
        // TODO: validate and update state
        return [];
    }
}
