/// <reference path="../../bs.ts" />

namespace bs {

    export namespace components {

        export class Commands extends bs.core.Core {

            /**********************************************************************************/
            /*                                                                                */
            /*                                  PROPERTIES                                    */
            /*                                                                                */
            /**********************************************************************************/

            private _socket: bs.core.Socket = null;
            private _$commands: JQuery = null;
            private _templates: { [name: string]: Function } = {};

            /**********************************************************************************/
            /*                                                                                */
            /*                                  CONSTRUCTOR                                   */
            /*                                                                                */
            /**********************************************************************************/

            constructor() {
                super();

                this._$commands = $("commands");

                if (this._$commands.length <= 0) {
                    console.error("(bs.commands.component) Missing tag <commands></commands>");
                    return this;
                }

                this._templates = {
                    "commands": bs.template.get("commands")
                };

                this._socket = new bs.core.Socket();
            }

            /**********************************************************************************/
            /*                                                                                */
            /*                                PUBLIC MEMBERS                                  */
            /*                                                                                */
            /**********************************************************************************/

            public showStarterLayout = (): bs.components.Commands => {
                this._$commands.html(this._templates["commands"]({
                    sendOrder: "hidden",
                    commandType: "card-inverse card-blue",
                    commandTitle: "Prepare your ships for the battle!",
                    commandDescription:
                    "<li>Click on a ship to rotate it.</li>" +
                    "<li>Drag and drop a ship move it on the map.</li>" +
                    "<li>Click on the \"Start game\" button once you are ready.</li>"
                }));
                return this;
            };

            public showBombLayout = (): bs.components.Commands => {
                this._$commands.html(this._templates["commands"]({
                    startGame: "hidden",
                    commandType: "card-inverse card-orange",
                    commandTitle: "Choose your coordinates and fire at will!",
                    commandDescription:
                    "<li>Click on the map to select a location for your bomb.</li>" +
                    "<li>Click on the \"Send order\" button once you are ready.</li>"
                }));
                return this;
            };

            public showWaitingLayout = (): bs.components.Commands => {
                this._$commands.html(this._templates["commands"]({
                    startGame: "hidden",
                    sendOrder: "hidden",
                    commandType: "card-inverse card-green",
                    commandTitle: "Strategy never wait.",
                    commandDescription:
                    "<li>It is now time for your opponent to make his move.</li>" +
                    "<li>In the meantime, try to think of your next hit.</li>"
                }));
                return this;
            };

        }

        /**********************************************************************************/
        /*                                                                                */
        /*                               PRIVATE MEMBERS                                  */
        /*                                                                                */
        /**********************************************************************************/

    }

}
