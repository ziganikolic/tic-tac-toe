<?php

namespace App\Http\Controllers\Game;

use App\Http\Controllers\Controller;
use App\Services\Game\MoveValidator;
use App\Services\Game\StateStore;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function __construct(private StateStore $store, private MoveValidator $validator)
    {
    }

    public function show(int $room)
    {
        return response()->json($this->store->getState($room));
    }

    public function storeMove(Request $request, int $room)
    {
        $data = $request->validate([
            'mini.row' => 'required|integer|min:0',
            'mini.col' => 'required|integer|min:0',
            'cell.row' => 'required|integer|min:0',
            'cell.col' => 'required|integer|min:0',
        ]);

        $state = $this->store->getState($room);
        $move = [
            'mini' => ['row' => $data['mini']['row'], 'col' => $data['mini']['col']],
            'cell' => ['row' => $data['cell']['row'], 'col' => $data['cell']['col']],
            'player' => $state['current'],
            'moveIndex' => $state['moveIndex'] + 1,
        ];

        if (! $this->validator->validate($state, $move)) {
            return response()->json(['message' => 'Invalid move'], 422);
        }

        $state = $this->store->applyMove($room, $move);
        $this->store->broadcastState($room, $state);

        return response()->json($state);
    }
}

