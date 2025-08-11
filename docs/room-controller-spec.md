# RoomController API Contract

Defines REST endpoints and the corresponding WebSocket event for
synchronising Ultimate Tic-Tac-Toe rooms.

## REST Endpoints

### `POST /rooms`
Create a new room.
- **Response:** `{ "roomId": number, "state": GameState }`

### `GET /rooms/{roomId}`
Fetch current game state for the given room.
- **404** when the room does not exist.
- **Response:** `{ "state": GameState }`

### `POST /rooms/{roomId}/join`
Join the specified room.
- First two unique users receive symbols **X** and **O**.
- Additional users join as spectators.
- **Response:** `{ "state": GameState }`

### `POST /rooms/{roomId}/moves`
Submit a move to the room.
- Server validates the move and updates state.
- Updated state is stored in Redis.
- On success, a `state_sync` event is broadcast to other clients.
- **Response:** `{ "state": GameState }`

### `POST /rooms/{roomId}/leave` (optional)
Leave the room and free the player's slot if necessary.
- **Response:** `{ "state": GameState }`

## WebSocket Event

### `state_sync`
Broadcast on presence channel `room.{roomId}`.

Payload:
```json
{ "state": GameState }
```
