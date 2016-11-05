/// <reference path="../../bs.ts" />

namespace bs {

    export namespace core {

        let _socket: SocketIOClient.Socket = io("http://localhost:9001");
        let _instance: bs.core.Socket = null;
        let _eventPrefix: string = "BS::SOCKET::";
        let _messages: Array<string> = [
            "nickname",
            "play turn",
            "list games",
            "new player",
            "game state",
            "turn result",
            "game created",
            "player ready",
            "ship placement"
        ];

        export class Socket extends bs.core.Core {

            /**********************************************************************************/
            /*                                                                                */
            /*                                  PROPERTIES                                    */
            /*                                                                                */
            /**********************************************************************************/


            /**********************************************************************************/
            /*                                                                                */
            /*                                  CONSTRUCTOR                                   */
            /*                                                                                */
            /**********************************************************************************/

            constructor() {
                super();

                if (bs.utils.isNull(_instance)) {
                    _instance = this;

                    bs.utils.forEach(_messages, _bindMessageToEvent);
                }

                return _instance;
            }

            /**********************************************************************************/
            /*                                                                                */
            /*                                PUBLIC MEMBERS                                  */
            /*                                                                                */
            /**********************************************************************************/

            public emit = (message: string, value?: any): bs.core.Socket => {
                _socket.emit(message, value);
                return _instance;
            };

        }

        /**********************************************************************************/
        /*                                                                                */
        /*                               PRIVATE MEMBERS                                  */
        /*                                                                                */
        /**********************************************************************************/

        function _bindMessageToEvent(message: string): bs.core.Socket {
            let event = _castMessageToEvent(message);
            _socket.on(message, data => {
                bs.events.broadcast(event, data);
            });
            return _instance;
        }

        function _castMessageToEvent(message: string): string {
            return _eventPrefix + message.toUpperCase().replace(/ /g, "_");
        }

    }

}
