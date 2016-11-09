/// <reference path="../../bs.ts" />

namespace bs {

    export namespace components {

        const _statusTemplate: string = "<div class=\"message col-xs-12\">" +
            "<div class=\"message-status font-italic\">[ <%= date %>: <%= nickname %> has <%= status %> the room ]</div>" +
            "</div>";

        const _otherMessageTemplate: string = "<div class=\"message-wrapper\">" +
            "<div class=\"other message col-xs-12 col-md-10\">" +
            "<div class=\"message-body-wrapper\">" +
            "<div class=\"message-body\" style=\"background-color: <%= messageColor %>;\"><%= message %></div>" +
            "</div>" +
            "<div class=\"message-author text-right\" title=\"<%= author %> on <%= date %>\">" +
            "<span class=\"author\" style=\"color: <%= authorColor %>;\"><%= author %></span>" +
            "<span class=\"particle\">on</span>" +
            "<span class=\"date\"><%= date %></span>" +
            "</div>" +
            "</div>" +
            "</div>";

        const _userMessageTemplate: string = "<div class=\"message-wrapper\">" +
            "<div class=\"me message col-xs-12 col-md-10 offset-md-2\">" +
            "<div class=\"message-body-wrapper\">" +
            "<div class=\"message-body\" style=\"background-color: <%= messageColor %>;\"><%= message %></div>" +
            "</div>" +
            "<div class=\"message-author\" title=\"<%= author %> on <%= date %>\">" +
            "<span class=\"author\" style=\"color: <%= authorColor %>;\"><%= author %></span>" +
            "<span class=\"particle\">on</span>" +
            "<span class=\"date\"><%= date %></span>" +
            "</div>" +
            "</div>" +
            "</div>";

        const _messagesColor: Array<string> = [
            "#FF9500",
            "#FF3B30",
            "#FF1300",
            "#CEA500",
            "#4CD964",
            "#34AADC",
            "#007AFF",
            "#5856D6",
            "#FF2D55",
            "#8E8E93",
            "#FF4981",
            "#FF3A2D"
        ];

        export class Messages extends bs.core.Core {

            /**********************************************************************************/
            /*                                                                                */
            /*                                  PROPERTIES                                    */
            /*                                                                                */
            /**********************************************************************************/

            private _socket: bs.core.Socket = null;
            private _$input: JQuery = null;
            private _colors: { [id: string]: { author: string, message: string } } = {};
            private _session: People = null;
            private _messages: string = "";
            private _$element: JQuery = null;
            private _$container: JQuery = null;
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
                bs.events.on("BS::SOCKET::LEFT_ROOM", _someoneLeftTheRoom.bind(this));
                bs.events.on("BS::SOCKET::JOIN_ROOM", _someoneJoinedTheRoom.bind(this));
                bs.events.on("BS::SOCKET::PEOPLE_WRITING", _handlePeopleWriting.bind(this));
                bs.events.on("BS::SOCKET::PEOPLE_IN_ROOM", console.log.bind(console));
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

        function _handlePeopleStatusChange(people: People, status: string): bs.components.Messages {
            this._messages += _getStatusTemplate.call(this, people.nickname, status);
            this._$container.html(this._messages);
            this._$container.scrollTop(this._$container[0].scrollHeight);
            return this;
        }

        function _someoneJoinedTheRoom(people: People): bs.components.Messages {
            _handlePeopleStatusChange.call(this, people, "joined");
            return this;
        }

        function _someoneLeftTheRoom(people: People): bs.components.Messages {
            _handlePeopleStatusChange.call(this, people, "left");
            return this;
        }

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
                this._socket.emit(BSData.Events.emit.SOMEONE_STOPPED_WRITING);
                this._socket.emit(BSData.Events.emit.MESSAGE, _htmlEncode(message));
            }
            return this;
        }

        function _htmlEncode(value: string): string {
            return $("<div/>").text(value).html();
        }

        function _htmlDecode(value: string): string {
            return $("<div/>").html(value).text();
        }

        function _makeSafeStringOf(value: string): string {
            return _htmlDecode(_htmlEncode(value));
        }

        function _message(message: Message): bs.components.Messages {
            let _message = _parseMessage(message);
            this._messages += _getMessageTemplate.call(this, _message);
            this._$container.html(this._messages);
            this._$container.scrollTop(this._$container[0].scrollHeight);
            return this;
        }

        function _showAuthorIndicator(data) {
            console.log(this, data);
        }

        function _nickname(people: People): bs.components.Messages {
            this._session = people;
            this._unbindNickname();
            return this;
        }

        function _handlePeopleWriting(people: { [peopleId: string]: People }): bs.components.Messages {
            // Not including the current session in the algorithm
            delete people[this._session.id];

            let peopleWriting = Object.keys(people);
            let numOfPeopleWriting = peopleWriting.length;

            if (numOfPeopleWriting <= 0) {
                this._$messageWritingIndicator.addClass("hidden");
            } else {
                if (numOfPeopleWriting > 2) {
                    this._$messageWritingIndicator.text(numOfPeopleWriting + " people are writing...");
                } else if (numOfPeopleWriting === 2) {
                    let names = people[peopleWriting[0]].nickname + " and " + people[peopleWriting[1]].nickname;
                    this._$messageWritingIndicator.text(names + " are writing...");
                } else if (numOfPeopleWriting > 0) {
                    this._$messageWritingIndicator.text(people[peopleWriting[0]].nickname + " is writing...");
                }

                this._$messageWritingIndicator.removeClass("hidden");
            }

            return this;
        }

        function _formatDate(date: string | Date): string {
            return moment(date).format("DD/MM/YY - HH:mm:ss");
        }

        function _getMessageTemplate(message: Message): string {

            let isUser = (message.id === this._session.id);
            let colors = _getColorsFor.call(this, message.id);
            let template = (isUser ? _userMessageTemplate : _otherMessageTemplate);

            return template
                .replace(/<%= date %>/g, _formatDate(message.date))
                .replace(/<%= author %>/g, (isUser ? "you" : message.nickname))
                .replace(/<%= message %>/g, message.message)
                .replace(/<%= authorColor %>/g, colors.author)
                .replace(/<%= messageColor %>/g, colors.message);
        }

        function _getStatusTemplate(nickname: string, status: string): string {
            return _statusTemplate
                .replace(/<%= date %>/g, _formatDate(new Date))
                .replace(/<%= nickname %>/g, nickname)
                .replace(/<%= status %>/g, status);
        }

        function _getColorsFor(id: string): { author: string, message: string } {
            if (bs.utils.isUndefined(this._colors[id])) {
                this._colors[id] = {
                    author: randomColor({luminosity: "dark"}),
                    message: _messagesColor[Math.floor(Math.random() * _messagesColor.length)]
                };
            }
            return this._colors[id];
        }

        function _parseMessage(message: Message): Message {
            return {
                id: _makeSafeStringOf(message.id),
                date: message.date,
                message: _htmlDecode(message.message),
                nickname: _makeSafeStringOf(message.nickname)
            };
        }

    }

}
