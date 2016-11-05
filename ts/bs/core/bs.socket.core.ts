/// <reference path="../../bs.ts" />

namespace bs {

    export namespace core {

        let _socket: SocketIOClient.Socket = null;
        let _instance: bs.core.Socket = null;
        let _messages: { [message: string]: string } = BSData.getEvents().on;
        let _connected: boolean = false;
        let _eventPrefix: string = "BS::SOCKET::";

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
                }

                return _instance;
            }

            /**********************************************************************************/
            /*                                                                                */
            /*                                PUBLIC MEMBERS                                  */
            /*                                                                                */
            /**********************************************************************************/

            public connect = (URL: string): JQueryPromise<void> => {
                let deferred = $.Deferred<void>();

                _socket = io(URL);

                _socket.on("connect", () => {
                    _connected = true;
                    console.info("(bs.socket.core) Successfully connected to: %s", URL);
                    _bindSocket();
                    deferred.resolve();
                });

                _socket.on("connect_error", (error: Object) => {
                    _connected = false;
                    console.error("(bs.socket.core) Cannot connect to: %s", URL);
                    _unbindSocket();
                    deferred.reject(error);
                });

                _socket.on("disconnect", () => {
                    _connected = false;
                    _unbindSocket();
                });

                _socket.on("reconnect", () => {
                    _connected = true;
                    _bindSocket();
                });

                _socket.on("reconnecting", (attempt: number) => {
                    console.info("(bs.socket.core) Attempting reconnection #%s...", attempt);
                });

                _socket.on("reconnect_failed", () => {
                    console.error("(bs.socket.core) Cannot reconnect to server.");
                });

                _socket.on("error", console.error.bind(console));

                return deferred.promise();
            };

            public emit = (message: string, data?: any): bs.core.Socket => {
                if (_connected) {
                    if (bs.utils.isUndefined(data)) {
                        console.log("(bs.socket.core) Emitting message: [%s]", message);
                        _socket.emit(message);
                    } else {
                        console.log("(bs.socket.core) Emitting message: [%s] =", message, data);
                        _socket.emit(message, data);
                    }
                } else {
                    console.error("(bs.socket.core) You have to establish a connection to the server in order to emit a message.");
                }
                return _instance;
            };

        }

        /**********************************************************************************/
        /*                                                                                */
        /*                               PRIVATE MEMBERS                                  */
        /*                                                                                */
        /**********************************************************************************/

        function _bindSocket(): bs.core.Socket {
            bs.utils.forEach(_messages, (event: string, message: string) => {
                _socket.on(message, (data?: any) => {
                    if (bs.utils.isUndefined(data)) {
                        console.log("(bs.socket.core) Received message: [%s]", message);
                        bs.events.broadcast(_eventPrefix + event);
                    } else {
                        console.log("(bs.socket.core) Received message: [%s] =", message, data);
                        bs.events.broadcast(_eventPrefix + event, data);
                    }
                });
            });
            return _instance;
        }

        function _unbindSocket(): bs.core.Socket {
            bs.utils.forEach(_messages, _socket.off);
            return _instance;
        }

    }

}
