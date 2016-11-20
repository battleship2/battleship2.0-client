/// <reference path="../../bs.ts" />

namespace bs {

    export namespace core {

        let _game: bs.core.Game = null;
        let _chat: bs.components.Chat = null;
        let _board: bs.core.Board = null;
        let _canvas: JQuery = null;
        let _overlay: JQuery = null;
        let _instance: bs.core.GUI = null;
        let _commands: bs.components.Commands = null;
        let _constants: bs.core.Constants = null;
        let _hitCounter: bs.components.Counter = null;
        let _bombCounter: bs.components.Counter = null;
        let _shipDestroyedCounter: bs.components.Counter = null;
        let _selectedBombLocation: {x: number, y: number} = null;

        export class GUI extends bs.core.Core {

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

                    console.debug("(bs.gui.core) TODO: Check for warning when leaving or refreshing page if a game is playing");

                    _game = new bs.core.Game();
                    _board = new bs.core.Board();
                    _constants = new bs.core.Constants();

                    _chat = new bs.components.Chat();
                    _commands = new bs.components.Commands();
                    _hitCounter = new bs.components.Counter(0, "#hits-counter");
                    _bombCounter = new bs.components.Counter(0, "#bombs-counter");
                    _shipDestroyedCounter = new bs.components.Counter(0, "#ship-destroyed-counter");

                    _canvas = $(_constants.get("canvas").node);
                    _overlay = $(".overlay");

                        console.debug("(bs.gui.core) TODO: Plug hits counter to server response here");
                    console.debug("(bs.gui.core) TODO: Plug ships destroyed counter to server response here");
                    // bs.events.on(_enum.events.bomb.hit, _hitCounter.increment);
                    // bs.events.on(_enum.events.ship.destroyed, _shipDestroyedCounter.increment);
                }

                return _instance;
            }

            /**********************************************************************************/
            /*                                                                                */
            /*                                PUBLIC MEMBERS                                  */
            /*                                                                                */
            /**********************************************************************************/

            public bombLocationSelected = (x: number, y: number): bs.core.GUI => {
                $("#send-order").removeAttr("disabled");
                _selectedBombLocation = {x: x, y: y};
                return _instance;
            };

            public showOverlay = (): bs.core.GUI => {
                if (bs.utils.isElement(_overlay)) {
                    let offset = _canvas.position();
                    _overlay
                        .width(_canvas.width())
                        .height(_canvas.height())
                        .offset({ top: offset.top + 1, left: offset.left + 1 })
                        .removeClass("hidden");
                }
                return _instance;
            };

            public hideOverlay = (): bs.core.GUI => {
                if (bs.utils.isElement(_overlay)) {
                    _overlay.addClass("hidden");
                }
                return _instance;
            };

            public showStarterHint = (): bs.core.GUI => {
                _commands.showStarterLayout();
                $("#start-game").click(_startGame);
                return _instance;
            };

            public showDropBombHint = (): bs.core.GUI => {
                _commands.showBombLayout();
                $("#send-order").click(_sendCommand);
                return _instance;
            };

            public showWaitingForOpponentHint = (): bs.core.GUI => {
                _commands.showWaitingLayout();
                return _instance;
            };

        }

        /**********************************************************************************/
        /*                                                                                */
        /*                               PRIVATE MEMBERS                                  */
        /*                                                                                */
        /**********************************************************************************/

        function _sendCommand(): bs.core.GUI {
            _game.sendBombCoordinates(_selectedBombLocation.x, _selectedBombLocation.y);
            _selectedBombLocation = null;
            _bombCounter.increment();
            return _instance;
        }

        function _startGame(): bs.core.GUI {
            _instance.showDropBombHint();
            _game.start();
            _game.state(BSData.Names.PLAYER);
            _board.draw();
            return _instance;
        }

    }

}
