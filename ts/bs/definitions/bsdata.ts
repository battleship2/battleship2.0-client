namespace BSData {
    export enum GameState { READY, PLAYING, SETTING, WAITING_PLAYERS }
    export enum ActionType { BOMB }

    let _events = {
        on: {
            "message": "MESSAGE",
            "refused": "REFUSED",
            "nickname": "NICKNAME",
            "game left": "GAME_LEFT",
            "play turn": "PLAY_TURN",
            "new round": "NEW_ROUND",
            "game state": "GAME_STATE",
            "list games": "LIST_GAMES",
            "new player": "NEW_PLAYER",
            "player left": "PLAYER_LEFT",
            "server reset": "SERVER_RESET",
            "turn results": "TURN_RESULTS",
            "game created": "GAME_CREATED",
            "player ready": "PLAYER_READY",
            "ship placement": "SHIP_PLACEMENT"
        },

        emit: {
            READY: "ready",
            MESSAGE: "message",
            JOIN_GAME: "join game",
            LIST_GAME: "list games",
            PLAY_TURN: "play turn",
            DISCONNECT: "disconnect",
            LEAVE_GAME: "leave game",
            CREATE_GAME: "create game",
            PLACE_SHIPS: "place ships"
        }
    };

    export function getEvents() {
        return _events;
    }
}
