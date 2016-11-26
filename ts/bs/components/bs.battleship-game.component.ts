/// <reference path="../../bs.ts" />

namespace bs {

    export namespace components {

        let _socket: bs.core.Socket = null;
        let _instance: bs.components.BattleshipGame = null;
        let _$battleshipGame: JQuery = null;

        export class BattleshipGame extends bs.core.Core {

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

                    _$battleshipGame = $("battleship-game");

                    if (_$battleshipGame.length <= 0) {
                        console.error("(bs.battleship-game.component) Missing tag <battleship-game></battleship-game>");
                        return this;
                    }

                    _socket = new bs.core.Socket();

                    let loader = new bs.core.Loader();

                    loader.setManifest([
                        { id: "MAP",        src: "map.png" },
                        { id: "LOGO",       src: "logo.png" },
                        { id: "MARK",       src: "mark.png" },
                        { id: "TARGET",     src: "target.png" },
                        { id: "PLAYER",     src: "player.png" },
                        { id: "CRUISER",    src: "ships/cruiser.png" },
                        { id: "CARRIER",    src: "ships/carrier.png" },
                        { id: "SUBMARINE",  src: "ships/submarine.png" },
                        { id: "DESTROYER",  src: "ships/destroyer.png" },
                        { id: "BATTLESHIP", src: "ships/battleship.png" }
                    ]);

                    loader.loadAssets(
                        () => {
                            _$battleshipGame.html(bs.template.get("battleship-game")());
                            new bs.core.Game().setup();
                        },
                        () => { console.error("Error while loading assets..."); }
                    );
                }

                return _instance;
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

        }

    }

}
