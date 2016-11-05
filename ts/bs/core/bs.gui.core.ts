/// <reference path="../../bs.ts" />

namespace bs {

    export namespace core {

        let _game: bs.core.Game = null;
        let _board: bs.core.Board = null;
        let _hints: bs.components.Hints = null;
        let _overlay: JQuery = null;
        let _instance: bs.core.GUI = null;
        let _constants: bs.core.Constants = null;
        let _hitCounter: bs.components.Counter = null;
        let _bombCounter: bs.components.Counter = null;
        let _startGameButton: JQuery = $("#startGame");
        let _sendCommandButton: JQuery = $("#sendCommand");
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

                    console.info("TODO: Check for warning when leaving or refreshing page if a game is playing");

                    _overlay = $(".overlay");

                    _game = new bs.core.Game();
                    _board = new bs.core.Board();
                    _constants = new bs.core.Constants();

                    _startGameButton.click(_startGame);
                    _sendCommandButton.click(_sendCommand);

                    _hints = new bs.components.Hints("#hints");
                    _hitCounter = new bs.components.Counter(0, "#hits-counter");
                    _bombCounter = new bs.components.Counter(0, "#bombs-counter");
                    _shipDestroyedCounter = new bs.components.Counter(0, "#ship-destroyed-counter");

                    console.info("TODO: Plug hits counter to server response here");
                    console.info("TODO: Plug ships destroyed counter to server response here");
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
                _sendCommandButton.removeAttr("disabled");
                _selectedBombLocation = {x: x, y: y};
                return _instance;
            };

            public showOverlay = (): bs.core.GUI => {
                if (bs.utils.isElement(_overlay)) {
                    _overlay.removeClass("hidden");
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
                _hints.show(
                    "Prepare your ships for the battle!",
                    "<ul>" +
                    "<li>Click on a ship to rotate it</li>" +
                    "<li>Drag and drop a ship move it on the map</li>" +
                    "<li>Click on the \"Start game\" button once you are ready</li>" +
                    "</ul>"
                );
                return _instance;
            };

            public showDropBombHint = (): bs.core.GUI => {
                _hints.show(
                    "Choose your coordinates and fire at will!",
                    "<ul>" +
                    "<li>Click on the map to select a location for your bomb</li>" +
                    "<li>Click on the \"Send order\" button once you are ready</li>" +
                    "</ul>"
                );
                return _instance;
            };

            public showWaitingForOpponentHint = (): bs.core.GUI => {
                _hints.show(
                    "Strategy never wait.",
                    "<ul>" +
                    "<li>It is now time for your opponent to make his move</li>" +
                    "<li>In the meantime, try to think of your next hit</li>" +
                    "</ul>"
                );
                return _instance;
            };

            public showCommand = (): bs.core.GUI => {
                _sendCommandButton.parent().removeClass("hidden");
                return _instance;
            };

        }

        /**********************************************************************************/
        /*                                                                                */
        /*                               PRIVATE MEMBERS                                  */
        /*                                                                                */
        /**********************************************************************************/

        function _sendCommand(): bs.core.GUI {
            _sendCommandButton.parent().addClass("hidden");
            _sendCommandButton.attr("disabled", "true");
            _game.sendBombCoordinates(_selectedBombLocation.x, _selectedBombLocation.y);
            _selectedBombLocation = null;
            _bombCounter.increment();
            return _instance;
        }

        function _startGame(): bs.core.GUI {
            _startGameButton.parent().addClass("hidden");
            _instance.showCommand();
            _game.start();
            _game.state(_constants.get("enum").names.player);
            _board.draw();
            return _instance;
        }

    }

}
