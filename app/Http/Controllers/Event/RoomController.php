<?php

namespace App\Http\Controllers\Event;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

/**
 * Controller for managing Ultimate Tic-Tac-Toe rooms.
 *
 * All methods are server-authoritative and rely on Redis for state
 * persistence. Implementation is intentionally left as TODO.
 */
class RoomController extends Controller
{
    /**
     * Create a new room with an initial game state.
     *
     * TODO:
     * - Generate a unique room identifier.
     * - Build the initial GameState structure.
     * - Persist the state to Redis under the room id.
     * - Return response payload: { roomId, state }.
     */
    public function create()
    {
        // TODO: implement room creation logic.
    }

    /**
     * Retrieve current game state for the given room id.
     *
     * @param  int  $roomId
     *
     * TODO:
     * - Load state from Redis.
     * - If state is missing, respond with 404.
     * - Otherwise, return response payload: { state }.
     */
    public function get(int $roomId)
    {
        // TODO: implement state retrieval logic.
    }

    /**
     * Join a room as a player or spectator.
     *
     * @param  Request  $request
     * @param  int  $roomId
     *
     * TODO:
     * - Assign symbol X or O to the first two unique users.
     * - Additional unique users join as spectators.
     * - Return updated state in payload: { state }.
     */
    public function join(Request $request, int $roomId)
    {
        // TODO: implement join logic.
    }

    /**
     * Submit a move for the current player.
     *
     * @param  Request  $request
     * @param  int  $roomId
     *
     * TODO:
     * - Validate the move server-side.
     * - Apply the move to the game state.
     * - Persist updated state to Redis.
     * - Broadcast `state_sync` event to other clients.
     * - Return updated state in payload: { state }.
     */
    public function move(Request $request, int $roomId)
    {
        // TODO: implement move handling logic.
    }

    /**
     * (Optional) Leave the room.
     *
     * @param  Request  $request
     * @param  int  $roomId
     *
     * TODO:
     * - Remove user from room participants.
     * - Reassign player symbols if necessary.
     * - Return updated state in payload: { state }.
     */
    public function leave(Request $request, int $roomId)
    {
        // TODO: implement leave logic.
    }
}

