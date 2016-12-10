/// <reference path="../../bs.ts" />

namespace bs {

    export namespace components {

        let _socket: bs.core.Socket = null;
        let _instance: bs.components.BattleshipSetup = null;
        let _$createWarTab: JQuery = null;
        let _$publicWarsTab: JQuery = null;
        let _$createWarLayout: JQuery = null;
        let _$battleshipSetup: JQuery = null;
        let _$publicWarsLayout: JQuery = null;
        let _$joinTheWarButton: JQuery = null;

        export class BattleshipSetup extends bs.core.Core {

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

                    _$battleshipSetup = $("battleship-setup");

                    if (_$battleshipSetup.length <= 0) {
                        console.error("(bs.battleship-setup.component) Missing tag <battleship-setup></battleship-setup>");
                        return this;
                    }

                    _socket = new bs.core.Socket();

                    _$battleshipSetup.html(bs.template.get("battleship-setup")());

                    _$joinTheWarButton = _$battleshipSetup.find(".join-the-war").click(_joinTheWar);
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

        function _joinTheWar() {
            let bsGame = new bs.components.BattleshipGame();

            _$battleshipSetup.find(".container").animateCss("fadeOutLeftBig", () => {
                _$battleshipSetup.addClass("hidden");
            });

            setTimeout(() => {
                $(".navbar").removeClass("hidden");

                $("battleship-game")
                    .find("container")
                    .animateCss("fadeInRightBig");
            }, 150);
        }

    }

}
