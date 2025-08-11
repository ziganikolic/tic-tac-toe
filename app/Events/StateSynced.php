<?php

namespace App\Events;

use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class StateSynced implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public int $roomId, public array $state)
    {
    }

    public function broadcastOn(): PresenceChannel
    {
        return new PresenceChannel("room.{$this->roomId}");
    }

    public function broadcastAs(): string
    {
        return 'state_sync';
    }

    public function broadcastWith(): array
    {
        return ['state' => $this->state];
    }
}

