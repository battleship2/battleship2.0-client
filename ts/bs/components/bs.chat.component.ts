/// <reference path="../../bs.ts" />

namespace bs {

    export namespace components {

        let _connectionStatusClasses: Array<string> = ["connected", "connecting", "disconnected"];

        export class Chat extends bs.core.Core {

            /**********************************************************************************/
            /*                                                                                */
            /*                                  PROPERTIES                                    */
            /*                                                                                */
            /**********************************************************************************/

            private _$chat: JQuery = null;
            private _opened: boolean = false;
            private _socket: bs.core.Socket = null;
            private _$input: JQuery = null;
            private _people: { [id: string]: { color: string, image: string } } = {};
            private _$header: JQuery = null;
            private _session: People = null;
            private _templates: { [name: string]: Function } = {};
            private _$container: JQuery = null;
            private _$peopleList: JQuery = null;
            private _unbindNickname: Function = null;
            private _connectionStatus: string = BSData.ConnectionStatus.DISCONNECTED;
            private _newMessageInterval: number = null;
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
                    console.error("(bs.chat.components) Missing tag <chat></chat>");
                    return this;
                }

                this._templates = {
                    "chat": bs.template.get("chat"),
                    "status": bs.template.get("status"),
                    "people-list": bs.template.get("people-list"),
                    "user-message": bs.template.get("user-message"),
                    "other-message": bs.template.get("other-message")
                };

                this._socket = new bs.core.Socket();

                this._$chat.html(this._templates["chat"]());
                this._$input = this._$chat.find(".message-input");
                this._$header = this._$chat.find(".card-header");
                this._$container = this._$chat.find(".messages-container");
                this._$peopleList = this._$chat.find("people-list");
                this._$messageWritingIndicator = this._$chat.find(".message-writing-indicator");

                this._$input.keyup(_keyup.bind(this));
                this._unbindNickname = bs.events.on("BS::SOCKET::NICKNAME", _nickname.bind(this));
                this._debounceMessageCheck = $.throttle(500, _checkForMessageBeingWritten.bind(this));

                this._$peopleList.html(this._templates["people-list"]());

                this._$header.click(() => {
                    this._opened = !this._opened;
                    this._$chat.toggleClass("opened");
                    this._$header.removeClass("card-warning-important");
                    clearInterval(this._newMessageInterval);

                    if (this._$chat.hasClass("opened")) {
                        this._$input.focus();
                    }
                });

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

        function _handlePeopleInRoom(people: { [peopleId: string]: People }): bs.components.Chat {
            this._$peopleList.html(this._templates["people-list"]({
                numberOfPeople: Object.keys(people).length
            }));
            return this;
        }

        function _handlePeopleStatusChange(people: People, status: string): bs.components.Chat {
            this._$container.append(_getStatus.call(this, people.nickname, status));
            this._$container.scrollTop(this._$container[0].scrollHeight);
            return this;
        }

        function _someoneJoinedTheRoom(people: People): bs.components.Chat {
            _setUpPeople.call(this, people.id);
            _handlePeopleStatusChange.call(this, people, "joined");
            return this;
        }

        function _someoneLeftTheRoom(people: People): bs.components.Chat {
            delete this._people[people.id];
            _handlePeopleStatusChange.call(this, people, "left");
            return this;
        }

        function _keyup(event?: any): bs.components.Chat {
            let keycode = event.keyCode || event.which;

            switch (keycode) {
                case 13: // ENTER key
                    _sendMessage.call(this, this._$input.val());
                    break;
            }

            this._debounceMessageCheck();
            return this;
        }

        function _checkForMessageBeingWritten(): bs.components.Chat {
            let message = this._$input.val();
            if (bs.utils.isString(message) && message.trim().length > 0) {
                this._socket.emit(BSData.Events.emit.SOMEONE_IS_WRITING);
            } else {
                this._socket.emit(BSData.Events.emit.SOMEONE_STOPPED_WRITING);
            }
            return this;
        }

        function _sendMessage(message: string): bs.components.Chat {
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

        function _message(message: Message): bs.components.Chat {
            let _message = _parseMessage(message);
            let _template = _setMessageTemplate.call(this, _message);
            _template.animateCss("fadeIn", () => {
                this._$container.scrollTop(this._$container[0].scrollHeight);
            });

            this._$container.append(_template);

            if (message.id !== this._session && !this._opened) {
                this._$header.toggleClass("card-warning-important");
                this._newMessageInterval = setInterval(() => {
                    this._$header.toggleClass("card-warning-important");
                }, 1000);
            }
            return this;
        }

        function _nickname(people: People): bs.components.Chat {
            this._session = people;
            this._unbindNickname();
            return this;
        }

        function _handlePeopleWriting(people: { [peopleId: string]: People }): bs.components.Chat {
            // Not including the current session in the algorithm
            delete people[this._session.id];

            let peopleWriting = Object.keys(people);
            let numOfPeopleWriting = peopleWriting.length;

            if (numOfPeopleWriting <= 0) {
                this._$messageWritingIndicator.addClass("hidden");
                if (this._opened) {
                    this._$chat.css("bottom", 0);
                }
            } else {
                if (numOfPeopleWriting > 2) {
                    this._$messageWritingIndicator.text(numOfPeopleWriting + " people are writing...");
                } else if (numOfPeopleWriting === 2) {
                    let names = people[peopleWriting[0]].nickname + " and " + people[peopleWriting[1]].nickname;
                    this._$messageWritingIndicator.text(names + " are writing...");
                } else if (numOfPeopleWriting > 0) {
                    this._$messageWritingIndicator.text(people[peopleWriting[0]].nickname + " is writing...");
                }

                if (this._opened) {
                    this._$chat.css("bottom", 27);
                }
                this._$messageWritingIndicator.removeClass("hidden");
            }

            return this;
        }

        function _formatDate(date: string | Date): string {
            return moment(date).format("DD/MM/YY - HH:mm:ss");
        }

        function _setMessageTemplate(message: Message): JQuery {
            let isUser = (message.id === this._session.id);
            let color = _getColorsFor.call(this, message.id);
            let template = this._templates[isUser ? "user-message" : "other-message"];
            let b64Identifier = btoa(message.id);

            if (!bs.utils.cssRuleExists(b64Identifier)) {
                $("head").append(
                    "<style type=\"text/css\"> " +
                    "." + b64Identifier + " { background-color: " + color + "; } " +
                    "." + b64Identifier + ":before { border-" +  (isUser ? "right" : "left") + ": 20px solid " + color + "; } " +
                    "</style>"
                );
            }

            let _$template = $(template({
                date: _formatDate(message.date),
                color: color,
                avatar: this._people[message.id].image,
                author: (isUser ? "you" : message.nickname),
                message: message.message,
                userIdentifier: b64Identifier
            }));

            if (!isUser) {
                _$template.find(".user-avatar").click(() => {
                    this._$input.val(this._$input.val() + "@" + message.nickname + " ");
                    this._$input.focus();
                });
            }

            return _$template;
        }

        function _getStatus(nickname: string, status: string): JQuery {
            return $(this._templates["status"]({
                status: status,
                nickname: nickname
            }));
        }

        function _getColorFor(id: string): string {
            return randomColor({seed: id, luminosity: "dark"});
        }

        function _getColorsFor(id: string): { author: string, message: string } {
            if (bs.utils.isUndefined(this._people[id])) {
                _setUpPeople.call(this, id);
            }
            return this._people[id].color;
        }

        function _parseMessage(message: Message): Message {
            return {
                id: _makeSafeStringOf(message.id),
                date: message.date,
                message: _htmlDecode(message.message).replace(/{/g, "&#123;").replace(/}/g, "&#125;"),
                nickname: _makeSafeStringOf(message.nickname)
            };
        }

        function _makeAvatar(id: string): string {
            let imgSource = "img/user_placeholder.png";
            if (vizhash.supportCanvas()) {
                try {
                    imgSource = vizhash.canvasHash(id, 32, 32).canvas.toDataURL();
                } catch (exception) {
                    console.error("VizHash error:", exception.message);
                    return imgSource;
                }
            }
            return imgSource;
        }

        function _setUpPeople(id: string) {
            this._people[id] = {
                image: _makeAvatar(id),
                color: _getColorFor(id)
            };
        }

    }

}
