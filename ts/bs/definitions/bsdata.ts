namespace BSData {
    export namespace States {
        export const READY: number = 0;
        export const PLAYING: number = 1;
        export const SETTING: number = 2;
        export const WAITING_PLAYERS: number = 3;
    }

    export namespace Actions {
        export const BOMB: number = 0;
    }

    export namespace Names {
        export const MAP: string = "MAP";
        export const PLAYER: string = "PLAYER";
        export const OPPONENT: string = "OPPONENT";
    }

    export namespace Events {
        export const on = {
            "message": "MESSAGE",
            "refused": "REFUSED",
            "nickname": "NICKNAME",
            "game left": "GAME_LEFT",
            "play turn": "PLAY_TURN",
            "new round": "NEW_ROUND",
            "left room": "LEFT_ROOM",
            "join room": "JOIN_ROOM",
            "game state": "GAME_STATE",
            "list games": "LIST_GAMES",
            "new player": "NEW_PLAYER",
            "player left": "PLAYER_LEFT",
            "server reset": "SERVER_RESET",
            "turn results": "TURN_RESULTS",
            "game created": "GAME_CREATED",
            "player ready": "PLAYER_READY",
            "people writing": "PEOPLE_WRITING",
            "ship placement": "SHIP_PLACEMENT",
            "people in room": "PEOPLE_IN_ROOM"
        };

        export const emit = {
            READY: "ready",
            MESSAGE: "message",
            JOIN_GAME: "join game",
            PLAY_TURN: "play turn",
            LIST_GAMES: "list games",
            DISCONNECT: "disconnect",
            LEAVE_GAME: "leave game",
            CREATE_GAME: "create game",
            PLACE_SHIPS: "place ships",
            SOMEONE_IS_WRITING: "someone is writing",
            SOMEONE_STOPPED_WRITING: "someone stopped writing"
        };
    }
}
