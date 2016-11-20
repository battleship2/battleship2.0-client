/// <reference path="../../bs.ts" />

namespace bs {

    export namespace core {

        let _map: bs.core.Map = null;
        let _gui: bs.core.GUI = null;
        let _board: bs.core.Board = null;
        let _socket: bs.core.Socket = null;
        let _instance: bs.core.Game = null;
        let _gameState: string = null;
        let _gameSetup: boolean = null;
        let _constants: bs.core.Constants = null;
        let _gameStarted: boolean = false;
        let _debugEnabled: boolean = true;

        export class Game extends bs.core.Core {

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

                    _map = new bs.core.Map();
                    _gui = new bs.core.GUI();
                    _board = new bs.core.Board();
                    _socket = new bs.core.Socket();
                    _constants = new bs.core.Constants();
                    _debugEnabled = true /*__debugEnabled__*/;

                    _socket
                        .connect("http://localhost:9001")
                        .then(() => {
                            // this.setup();
                            _socket.emit(BSData.Events.emit.READY);
                        });
                }

                return _instance;
            }

            /**********************************************************************************/
            /*                                                                                */
            /*                                PUBLIC MEMBERS                                  */
            /*                                                                                */
            /**********************************************************************************/

            public start = (): bs.core.Game => {
                if (_gameStarted) {
                    console.error("The game has already started!");
                    return _instance;
                }

                _gameStarted = true;

                console.debug("TODO: (bs.game.core) Set state according to who starts first (from server)");
                _instance.state(BSData.Names.PLAYER);

                return _instance;
            };

            public setup = (): bs.core.Game => {
                if (_gameSetup) {
                    console.error("The game has already been set up!");
                    return _instance;
                }

                _gameSetup = true;

                _gameState = BSData.Names.PLAYER;

                _board.setup();

                console.debug("TODO: (bs.game.core) Create ships depending on server game configuration");
                _board.addShip(new bs.ships.Destroyer());
                _board.addShip(new bs.ships.Submarine());
                _board.addShip(new bs.ships.Cruiser());
                _board.addShip(new bs.ships.Battleship());
                _board.addShip(new bs.ships.Carrier());
                _board.drawShips();

                _gui.showStarterHint();

                return _instance;
            };

            public state = (gameState?: string): bs.core.Game | string => {
                if (bs.utils.isUndefined(gameState)) {
                    return _gameState;
                }

                _gameState = gameState;
                _stateChanged();
                _board.draw();

                return _instance;
            };

            public hasStarted = (): boolean => {
                return _gameStarted;
            };

            public hasDebugEnabled = (): boolean => {
                return _debugEnabled;
            };

            public sendBombCoordinates = (x: number, y: number): bs.core.Game => {
                if (this.state() !== BSData.Names.PLAYER) {
                    return _instance;
                }
                console.debug("TODO: (bs.game.core) Send bomb coordinates to server here");
                _map.savePlayerBombLocation(x, y);
                this.state(BSData.Names.OPPONENT);
                return _instance;
            };

        }

        /**********************************************************************************/
        /*                                                                                */
        /*                               PRIVATE MEMBERS                                  */
        /*                                                                                */
        /**********************************************************************************/

        function _stateChanged(): bs.core.Game {
            switch (_gameState) {
                case BSData.Names.PLAYER:
                    _board.clearShips();
                    console.debug("TODO: (bs.game.core) Draw player bombs here");
                    _board.hideOverlay();
                    _gui.showDropBombHint();
                    break;
                case BSData.Names.OPPONENT:
                    _board.freezeShips();
                    _board.drawShips();
                    console.debug("TODO: (bs.game.core) Draw opponent bombs here");
                    _board.showOverlay();
                    _gui.showWaitingForOpponentHint();
                    break;
            }

            return _instance;
        }

    }

}
