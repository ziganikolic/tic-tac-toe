<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\GameStateService;
use Symfony\Component\HttpFoundation\Response;

class RoomController extends Controller
{
    public function __construct(protected GameStateService $service) {}

    public function create(Request $request): Response
    {
        // TODO: validate rules, init room, return state
    }

    public function get(string $roomId): Response
    {
        // TODO: fetch state or 404
    }

    public function join(Request $request, string $roomId): Response
    {
        // TODO: assign role and broadcast player_joined
    }

    public function move(Request $request, string $roomId): Response
    {
        // TODO: validate and apply move using service
    }

    public function leave(Request $request, string $roomId): Response
    {
        // TODO: presence/forfeit logic
    }
}
