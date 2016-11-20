/// <reference path="../../bs.ts" />

namespace bs {

    export namespace core {

        let _game: bs.core.Game = null;
        let _chat: bs.components.Chat = null;
        let _board: bs.core.Board = null;
        let _instance: bs.core.GUI = null;
        let _commands: bs.components.Commands = null;
        let _counters: bs.components.Counters = null;
        let _constants: bs.core.Constants = null;
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

                    console.debug("TODO: (bs.gui.core) Check for warning when leaving or refreshing page if a game is playing");

                    _game = new bs.core.Game();
                    _board = new bs.core.Board();
                    _constants = new bs.core.Constants();

                    _chat = new bs.components.Chat();
                    _commands = new bs.components.Commands();
                    _counters = new bs.components.Counters();
                }

                return _instance;
            }

            /**********************************************************************************/
            /*                                                                                */
            /*                                PUBLIC MEMBERS                                  */
            /*                                                                                */
            /**********************************************************************************/

            public bombLocationSelected = (x: number, y: number): bs.core.GUI => {
                $(".send-order").removeAttr("disabled");
                _selectedBombLocation = {x: x, y: y};
                return _instance;
            };

            public showStarterHint = (): bs.core.GUI => {
                _commands.showStarterLayout();
                let startGameButton = $(".start-game");
                if (!_hasListener(startGameButton, "click")) {
                    startGameButton.click(_startGame);
                }
                return _instance;
            };

            public showDropBombHint = (): bs.core.GUI => {
                _commands.showBombLayout();
                let sendOrderButton = $(".send-order");
                if (!_hasListener(sendOrderButton, "click")) {
                    sendOrderButton.click(_sendCommand);
                }
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

        function _hasListener($element: JQuery, listener: string): boolean {
            let elementEvents = $._data($element.get(0), "events");
            return bs.utils.isDefined(elementEvents) && bs.utils.isDefined(elementEvents[listener]);
        }

        function _sendCommand(): bs.core.GUI {
            _game.sendBombCoordinates(_selectedBombLocation.x, _selectedBombLocation.y);
            _selectedBombLocation = null;
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
