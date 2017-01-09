/// <reference path="../../bs.ts" />

namespace bs {

    export namespace components {

        let _socket: bs.core.Socket = null;
        let _instance: bs.components.BattleshipSetup = null;
        let _templates: { [name: string]: Function } = {};
        let _$createWarTab: JQuery = null;
        let _$publicWarsTab: JQuery = null;
        let _$createWarLayout: JQuery = null;
        let _$battleshipSetup: JQuery = null;
        let _privateWarsHidden: boolean = false;
        let _$publicWarsLayout: JQuery = null;
        let _$joinTheWarButton: JQuery = null;
        let _$hidePrivateWarsCheckbox: JQuery = null;

        let _testWars = [
            {
                name: "Yamakassi bitch hell yeah gros !",
                people: 2,
                maxPeople: 6,
                password: true
            },
            {
                name: "No Pain. No Gain.",
                people: 0,
                maxPeople: 4,
                password: false
            },
            {
                name: "Ricky Martin in da place",
                people: 5,
                maxPeople: 5,
                password: false
            },
            {
                name: "Ricky Martin in da place",
                people: 4,
                maxPeople: 5,
                password: true
            }
        ];

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

                    _templates = {
                        "war-item": bs.template.get("war-item"),
                        "battleship-setup": bs.template.get("battleship-setup")
                    };

                    _socket = new bs.core.Socket();

                    _$battleshipSetup.html(_templates["battleship-setup"]());

                    _$joinTheWarButton = _$battleshipSetup.find(".join-the-war").click(_joinTheWar);
                    _$hidePrivateWarsCheckbox = _$battleshipSetup.find(".hide-private-wars").click(_hidePrivateWars);

                    bs.utils.forEach(_testWars, war => {
                        let _warItemOptions = {
                            name: war.name,
                            people: war.people,
                            maxPeople: war.maxPeople,
                            hasPassword: war.password ? "" : "hidden",
                            privateWarClass: war.password ? "private-war" : ""
                        };
                        let _warItemTemplate = _templates["war-item"](_warItemOptions);
                        let $war = $(_warItemTemplate);

                        console.log($war);
                    });
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

        function _hidePrivateWars() {
            _privateWarsHidden = !_privateWarsHidden;

            if (_privateWarsHidden) {
                $(".private-war").hide();
            } else {
                $(".private-war").show();
            }
        }

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
