/// <reference path="../../bs.ts" />

namespace bs {

    export namespace components {

        const _entityMap: { [symbol: string]: string } = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "\"": "&quot;",
            "'": "&#39;",
            "/": "&#x2F;"
        };

        const _template: string = "<div class=\"message row\">" +
            "<div class=\"col-xs-2 message-author\" title=\"<%= author %> on <%= date %>\">" +
            "<div class=\"author ellipsis\" style=\"color: <%= color %>;\" ><%= author %></div>" +
            "<div class=\"date\"><%= date %></div>" +
            "</div>" +
            "<div class=\"col-xs-10 message-body\"><%= message %></div>" +
            "</div>";

        export class Messages extends bs.core.Core {

            /**********************************************************************************/
            /*                                                                                */
            /*                                  PROPERTIES                                    */
            /*                                                                                */
            /**********************************************************************************/

            private _socket: bs.core.Socket = null;
            private _$input: JQuery = null;
            private _colors: { [id: string]: string } = {};
            private _messages: string = "";
            private _$element: JQuery = null;
            private _sessionId: string = null;
            private _$container: JQuery = null;

            /**********************************************************************************/
            /*                                                                                */
            /*                                  CONSTRUCTOR                                   */
            /*                                                                                */
            /**********************************************************************************/

            constructor(element: string) {
                super();

                this._$element = $(element);
                this._socket = new bs.core.Socket();
                this._$input = this._$element.find(".message-input");
                this._$container = this._$element.find(".messages-container");

                this._$input.keypress(this.sendMessage);
                bs.events.on("BS::SOCKET::MESSAGE", this.appendMessage);
                bs.events.on("BS::SOCKET::NICKNAME", _handleNickname.bind(this));
            }

            /**********************************************************************************/
            /*                                                                                */
            /*                                PUBLIC MEMBERS                                  */
            /*                                                                                */
            /**********************************************************************************/

            public sendMessage = (event?: any): bs.components.Messages => {
                let keycode = event.keyCode || event.which;
                if (keycode === 13) {
                    let message = this._$input.val();
                    if (bs.utils.isString(message) && message.trim().length) {
                        this._$input.val("");
                        this._socket.emit(BSData.Events.emit.MESSAGE, message);
                    }
                }
                return this;
            };

            public appendMessage = (message: Message): bs.components.Messages => {
                let _message = _parseMessage(message);
                this._messages += _getTemplate.call(this, _message);
                this._$container.html(this._messages);
                return this;
            };

        }

        /**********************************************************************************/
        /*                                                                                */
        /*                               PRIVATE MEMBERS                                  */
        /*                                                                                */
        /**********************************************************************************/

        function _formatDate(date: string): string {
            return moment(date).format("DD/MM/YY - HH:mm");
        }

        function _getTemplate(message: Message): string {
            return _template
                .replace(/<%= date %>/g, _formatDate(message.date))
                .replace(/<%= color %>/g, _getColorFor.call(this, message.id))
                .replace(/<%= author %>/g, (message.id === this._sessionId ? "you" : message.nickname))
                .replace(/<%= message %>/g, message.message);
        }

        function _handleNickname(response: { id: string, nickname: string }): bs.components.Messages {
            this._sessionId = response.id;
            return this;
        }

        function _getColorFor(id: string): string {
            if (bs.utils.isUndefined(this._colors[id])) {
                this._colors[id] = randomColor({luminosity: "dark"});
            }
            return this._colors[id];
        }

        function _parseMessage(message: Message): Message {

            return {
                id: _makeSafeStringOf(message.id),
                date: message.date,
                message: _makeSafeStringOf(message.message),
                nickname: _makeSafeStringOf(message.nickname)
            };
        }

        function _makeSafeStringOf(value: string): string {
            return String(value).replace(/[&<>"'\/]/g, (s: string) => {
                return _entityMap[s];
            });
        }

    }

}
