import { Component } from "@angular/core";
import { BSSocketPlugin } from "../../definitions/abstracts";

@Component({
  selector: 'bsc-chat',
  styleUrls: [ 'chat.component.scss' ],
  templateUrl: 'chat.component.html'
})
export class ChatComponent implements BSSocketPlugin {
  public opened = false;

  public setup(): void {}
}
