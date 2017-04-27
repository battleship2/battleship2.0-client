///<reference path="../../../node_modules/@types/socket.io-client/index.d.ts"/>

import { Injectable } from "@angular/core";
import { Dictionary } from "../definitions/types";
import { isFunction, isUndefined } from "../core/utils/utils";
import { LoggerService } from "./logger.service";

@Injectable()
export class SocketService {
  private _socket: SocketIOClient.Socket = null;

  constructor(private _logger: LoggerService) {
  }

  public static get events(): Dictionary {
    return {
      READY: "ready",
      MESSAGE: "message",
      REFUSED: "refused",
      NICKNAME: "nickname",
      GAME_LEFT: "game left",
      NEW_ROUND: "new round",
      LEFT_ROOM: "left room",
      JOIN_ROOM: "join room",
      JOIN_GAME: "join game",
      PLAY_TURN: "play turn",
      GAME_STATE: "game state",
      NEW_PLAYER: "new player",
      LIST_GAMES: "list games",
      DISCONNECT: "disconnect",
      LEAVE_GAME: "leave game",
      CREATE_GAME: "create game",
      PLACE_SHIPS: "place ships",
      PLAYER_LEFT: "player left",
      SERVER_RESET: "server reset",
      TURN_RESULTS: "turn results",
      GAME_CREATED: "game created",
      PLAYER_READY: "player ready",
      PEOPLE_WRITING: "people writing",
      SHIP_PLACEMENT: "ship placement",
      PEOPLE_IN_ROOM: "people in room",
      SOMEONE_IS_WRITING: "someone is writing",
      SOMEONE_STOPPED_WRITING: "someone stopped writing"
    };
  }

  public get connected(): boolean {
    return this._socket && this._socket.connected;
  }

  public emit(message: string, data?: any): void {
    if (this.connected) {
      if (isUndefined(data)) {
        // console.log("(bs.socket.core) Emitting message: [%s]", message);
        this._socket.emit(message);
      } else {
        // console.log("(bs.socket.core) Emitting message: [%s] =", message, data);
        this._socket.emit(message, data);
      }
    } else {
      this._logger.error("(SocketService) You have to establish a connection to the server in order to emit a message.");
    }
  }

  public on(message: string, callback: Function): SocketIOClient.Emitter {
    return this._socket.on(message, (...args: any[]) => {
      this._logger.debug("(SocketService) Received message [%s] containing:", message, args);

      if (isFunction(callback)) {
        callback.call(callback, ...args);
      }
    });
  }

  public connect(url: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._socket = io(url);

      this.on("connecting", () => {
        // bs.events.broadcast("BS::SOCKET::CONNECTING");
        resolve();
      });

      this.on("connect", () => {
        this._logger.info("(SocketService) Successfully connected to:", url);
        // bs.events.broadcast("BS::SOCKET::CONNECTED");
        resolve();
      });

      this.on("connect_error", (error: Object) => {
        this._logger.error("(SocketService) Cannot connect to:", url);
        // bs.events.broadcast("BS::SOCKET::DISCONNECTED");
        reject(error);
      });

      this.on("disconnect", () => {
        this._logger.info("(SocketService) Disconnected from:", url);
        // bs.events.broadcast("BS::SOCKET::DISCONNECTED");
      });

      this.on("reconnecting", (attempt: number) => {
        this._logger.info("(SocketService) Attempting reconnection #" + attempt);
        // bs.events.broadcast("BS::SOCKET::CONNECTING");
      });

      this.on("reconnect_failed", () => {
        this._logger.error("(SocketService) Cannot reconnect to server.");
        // bs.events.broadcast("BS::SOCKET::DISCONNECTED");
      });

      this.on("error", this._logger.error.bind(this._logger));

    });
  }
}
