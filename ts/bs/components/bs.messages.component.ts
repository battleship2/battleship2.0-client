/// <reference path="../../bs.ts" />

namespace bs {

    export namespace components {

        let _connectionStatusClasses: Array<string> = ["connected", "connecting", "disconnected"];

        export class Messages extends bs.core.Core {

            /**********************************************************************************/
            /*                                                                                */
            /*                                  PROPERTIES                                    */
            /*                                                                                */
            /**********************************************************************************/

            private _$chat: JQuery = null;
            private _socket: bs.core.Socket = null;
            private _$input: JQuery = null;
            private _colors: { [id: string]: string } = {};
            private _session: People = null;
            private _messages: string = "";
            private _templates: { [name: string]: Function } = {};
            private _$container: JQuery = null;
            private _$peopleList: JQuery = null;
            private _unbindNickname: Function = null;
            private _connectionStatus: string = BSData.ConnectionStatus.DISCONNECTED;
            private _debounceMessageCheck: Function = null;
            private _$messageWritingIndicator: JQuery = null;

            /**********************************************************************************/
            /*                                                                                */
            /*                                  CONSTRUCTOR                                   */
            /*                                                                                */
            /**********************************************************************************/

            constructor() {
                super();

                this._$chat = $("chat");

                if (this._$chat.length <= 0) {
                    console.error("(bs.components.messages) Missing tag <chat></chat>");
                    return this;
                }

                this._templates = {
                    "chat": bs.template.get("chat"),
                    "status": bs.template.get("status"),
                    "people-list": bs.template.get("people-list"),
                    "user-message": bs.template.get("user-message"),
                    "other-message": bs.template.get("other-message"),
                    "people-nickname": bs.template.get("people-nickname")
                };

                this._socket = new bs.core.Socket();

                this._$chat.html(this._templates["chat"]());
                this._$peopleList = this._$chat.find("people-list").html(this._templates["people-list"]());

                this._$input = this._$chat.find(".message-input");
                this._$container = this._$chat.find(".messages-container");
                this._$messageWritingIndicator = this._$chat.find(".message-writing-indicator");

                this._$input.keyup(_keyup.bind(this));
                this._unbindNickname = bs.events.on("BS::SOCKET::NICKNAME", _nickname.bind(this));
                this._debounceMessageCheck = $.throttle(500, _checkForMessageBeingWritten.bind(this));

                bs.events.on("BS::SOCKET::CONNECTED", () => {
                    _handleConnectionStatusChanges.call(this, "connected", "Connected to Battleship 2.0 server");
                });

                bs.events.on("BS::SOCKET::CONNECTING", () => {
                    _handleConnectionStatusChanges.call(this, "connecting", "Attempting connection on Battleship 2.0 server");
                });

                bs.events.on("BS::SOCKET::DISCONNECTED", () => {
                    _handleConnectionStatusChanges.call(this, "disconnected", "Disconnected from Battleship 2.0 server");
                });

                bs.events.on("BS::SOCKET::MESSAGE", _message.bind(this));
                bs.events.on("BS::SOCKET::LEFT_ROOM", _someoneLeftTheRoom.bind(this));
                bs.events.on("BS::SOCKET::JOIN_ROOM", _someoneJoinedTheRoom.bind(this));
                bs.events.on("BS::SOCKET::PEOPLE_WRITING", _handlePeopleWriting.bind(this));
                bs.events.on("BS::SOCKET::PEOPLE_IN_ROOM", _handlePeopleInRoom.bind(this));
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

        function _tooltip() {
            $("[data-toggle=\"tooltip\"]").tooltip();
        }

        function _handleConnectionStatusChanges(classToAdd: string, title: string) {
            let _classesToRemove = <Array<string>>bs.utils.merge([], _connectionStatusClasses);
            _classesToRemove.splice(_connectionStatusClasses.indexOf(classToAdd), 1);

            this._connectionStatus = BSData.ConnectionStatus[classToAdd.trim().toUpperCase()];

            switch (this._connectionStatus) {
                case BSData.ConnectionStatus.CONNECTED:
                    this._$input.removeAttr("disabled");
                    break;
                case BSData.ConnectionStatus.CONNECTING:
                case BSData.ConnectionStatus.DISCONNECTED:
                    this._$input.attr("disabled", "true");
                    break;
            }

            $(".connection-status")
                .removeClass(_classesToRemove.join(" "))
                .addClass(classToAdd)
                .attr("title", title)
                .attr("data-original-title", title);

            _tooltip();
        }

        function _handlePeopleInRoom(people: { [peopleId: string]: People }): bs.components.Messages {
            console.log(people);
            let template = this._templates["people-nickname"];

            let peopleNicknames = "";
            let numOfPeopleInTheRoom = 0;

            bs.utils.forEach(people, (thePeople: People) => {
                let isUser = (thePeople.id === this._session.id);
                let color = _getColorsFor.call(this, thePeople.id);

                ++numOfPeopleInTheRoom;

                peopleNicknames += template({
                    color: color,
                    author: (isUser ? "(you) " : "") + thePeople.nickname
                });
            });

            this._$peopleList.html(this._templates["people-list"]({
                nicknames: peopleNicknames,
                numberOfPeople: numOfPeopleInTheRoom
            }));

            _tooltip();

            return this;
        }

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
            let color = _getColorsFor.call(this, message.id);
            let template = this._templates[isUser ? "user-message" : "other-message"];

            return template({
                date: _formatDate(message.date),
                author: (isUser ? "you" : message.nickname),
                message: message.message,
                authorColor: color,
                messageColor: color
            });
        }

        function _getStatusTemplate(nickname: string, status: string): string {
            return this._templates["status"]({
                date: _formatDate(new Date()),
                status: status,
                nickname: nickname
            });
        }

        function _getColorsFor(id: string): { author: string, message: string } {
            if (bs.utils.isUndefined(this._colors[id])) {
                this._colors[id] = randomColor({seed: id, luminosity: "dark"});
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
