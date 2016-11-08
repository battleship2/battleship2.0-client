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

            private _writingLock: boolean = false;
            private _waitForWriting: Array<People> = [];

            private _socket: bs.core.Socket = null;
            private _$input: JQuery = null;
            private _colors: { [id: string]: string } = {};
            private _session: People = null;
            private _messages: string = "";
            private _$element: JQuery = null;
            private _$container: JQuery = null;
            private _peopleWriting: { [id: string]: People } = {};
            private _unbindNickname: Function = null;
            private _debounceMessageCheck: Function = null;
            private _$messageWritingIndicator: JQuery = null;

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
                this._$messageWritingIndicator = this._$element.find(".message-writing-indicator");

                this._$input.keyup(_keyup.bind(this));
                this._$container.mouseenter(_hideMessageWritingIndicator.bind(this));
                this._$container.mouseleave(_showMessageWritingIndicator.bind(this));
                this._unbindNickname = bs.events.on("BS::SOCKET::NICKNAME", _nickname.bind(this));
                this._debounceMessageCheck = $.throttle(500, _checkForMessageBeingWritten.bind(this));

                bs.events.on("BS::SOCKET::MESSAGE", _message.bind(this));
                bs.events.on("BS::SOCKET::SOMEONE_IS_WRITING", _someoneIsWriting.bind(this));
                bs.events.on("BS::SOCKET::SOMEONE_STOPPED_WRITING", _someoneStoppedWriting.bind(this));
            }

            /**********************************************************************************/
            /*                                                                                */
            /*                                PUBLIC MEMBERS                                  */
            /*                                                                                */
            /**********************************************************************************/



        }

        /**********************************************************************************/
        /*                                                                                */
        /*                               PRIVATE MEMBERS                                  */
        /*                                                                                */
        /**********************************************************************************/

        function _showMessageWritingIndicator(): bs.components.Messages {
            this._$messageWritingIndicator.show();
            return this;
        }

        function _hideMessageWritingIndicator(): bs.components.Messages {
            this._$messageWritingIndicator.hide();
            return this;
        }

        function _keyup(event?: any): bs.components.Messages {
            let keycode = event.keyCode || event.which;

            switch (keycode) {
                case 13: // ENTER key
                    _sendMessage.call(this, this._$input.val());
                    break;
            }

            this._debounceMessageCheck();
            return this;
        }

        function _checkForMessageBeingWritten(): bs.components.Messages {
            let message = this._$input.val();
            if (bs.utils.isString(message) && message.trim().length > 0) {
                this._socket.emit(BSData.Events.emit.SOMEONE_IS_WRITING);
            } else {
                this._socket.emit(BSData.Events.emit.SOMEONE_STOPPED_WRITING);
            }
            return this;
        }

        function _sendMessage(message: string): bs.components.Messages {
            if (bs.utils.isString(message) && message.trim().length) {
                this._$input.val("");
                this._socket.emit(BSData.Events.emit.MESSAGE, message);
                this._socket.emit(BSData.Events.emit.SOMEONE_STOPPED_WRITING);
            }
            return this;
        }

        function _message(message: Message): bs.components.Messages {
            let _message = _parseMessage(message);
            this._messages += _getTemplate.call(this, _message);
            this._$container.html(this._messages);
            this._$container.scrollTop(this._$container[0].scrollHeight);
            return this;
        }

        function _nickname(people: People): bs.components.Messages {
            this._session = people;
            this._unbindNickname();
            return this;
        }

        function _handlePeopleWriting(people: People): bs.components.Messages {
            let peopleWriting = Object.keys(this._peopleWriting);
            let numOfPeopleWriting = peopleWriting.length;

            if (numOfPeopleWriting <= 0) {
                this._$messageWritingIndicator.addClass("hidden");
            } else {
                if (numOfPeopleWriting > 2) {
                    this._$messageWritingIndicator.text(numOfPeopleWriting + " people are writing...");
                } else if (numOfPeopleWriting === 2) {
                    let names = this._peopleWriting[peopleWriting[0]].nickname + " and " + this._peopleWriting[peopleWriting[1]].nickname;
                    this._$messageWritingIndicator.text(names + " are writing...");
                } else if (numOfPeopleWriting > 0) {
                    this._$messageWritingIndicator.text(people.nickname + " is writing...");
                }

                this._$messageWritingIndicator.removeClass("hidden");
            }

            this._writingLock = false;

            if (this._waitForWriting.length > 0) {
                this._someoneIsWriting.call(this, this._waitForWriting.pop());
            }

            return this;
        }

        function _someoneIsWriting(people: People): bs.components.Messages {
            if (this._session.id === people.id) {
                return this;
            }

            if (this._writingLock) {
                this._waitForWriting.push(people);
                return this;
            }

            this._writingLock = true;

            this._peopleWriting[people.id] = people;
            _handlePeopleWriting.call(this, people);
            return this;
        }

        function _someoneStoppedWriting(people: People): bs.components.Messages {
            console.log(people.nickname, "stopped writing, removing:", people.id);
            delete this._peopleWriting[people.id];
            _handlePeopleWriting.call(this, people);
            return this;
        }

        function _formatDate(date: string): string {
            return moment(date).format("DD/MM/YY - HH:mm");
        }

        function _getTemplate(message: Message): string {
            return _template
                .replace(/<%= date %>/g, _formatDate(message.date))
                .replace(/<%= color %>/g, _getColorFor.call(this, message.id))
                .replace(/<%= author %>/g, (message.id === this._session.id ? "you" : message.nickname))
                .replace(/<%= message %>/g, message.message);
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
