<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class StateSynced implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public function __construct(public string $roomId, public array $state) {}

    public function broadcastOn(): Channel
    {
        return new PresenceChannel('room.' . $this->roomId);
    }

    public function broadcastAs(): string
    {
        return 'state_sync';
    }
}
