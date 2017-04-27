import { Injectable } from "@angular/core";
import { SocketService } from "./socket.service";

@Injectable()
export class EngineService {
  constructor(private _socket: SocketService) {}

  public start(url: string): void {
    this._socket
      .connect(url)
      .then(() => {
        this._socket.on(SocketService.events.LIST_GAMES, (data) => console.log(data));
        this._socket.emit(SocketService.events.LIST_GAMES);
      });
  }
}
