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

                    _$createWarLayout = _$battleshipSetup.find(".create-war-layout");
                    _$createWarTab = _$battleshipSetup.find(".create-war").click(_switchToCreateWar);

                    _$publicWarsLayout = _$battleshipSetup.find(".public-wars-layout");
                    _$publicWarsTab = _$battleshipSetup.find(".public-wars").click(_switchToPublicWars);

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

        function _switchToCreateWar() {
            _$publicWarsTab.removeClass("active");
            _$createWarTab.addClass("active");

            _$publicWarsLayout.animateCss("BSFadeOutLeft", () => {
                _$publicWarsLayout.addClass("hidden");
            });

            setTimeout(() => {
                _$createWarLayout
                    .removeClass("hidden")
                    .animateCss("BSFadeInRight");
            }, 150);
        }

        function _switchToPublicWars() {
            _$createWarTab.removeClass("active");
            _$publicWarsTab.addClass("active");

            _$createWarLayout.animateCss("BSFadeOutRight", () => {
                _$createWarLayout.addClass("hidden");
            });

            setTimeout(() => {
                _$publicWarsLayout
                    .removeClass("hidden")
                    .animateCss("BSFadeInLeft");
            }, 150);
        }

    }

}
