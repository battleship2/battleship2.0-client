/// <reference path="../../bs.ts" />

namespace bs {

    export namespace core {

        let _game: bs.core.Game = null;
        let _instance: bs.core.Constants = null;
        let _constants: any = {};

        export class Constants extends bs.core.Core {

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

                    _game = new bs.core.Game();

                    _instance.update();
                }

                return _instance;
            }

            /**********************************************************************************/
            /*                                                                                */
            /*                                PUBLIC MEMBERS                                  */
            /*                                                                                */
            /**********************************************************************************/

            public get = (name?: string): any => {
                return bs.utils.isString(name) ? _constants[name] : _constants;
            };

            public update = (): bs.core.Constants => {
                _constants.canvas = {};
                _constants.canvas.node = document.getElementById("battlefield");
                _constants.canvas.size = {};
                _constants.canvas.size.width = 600;
                _constants.canvas.size.height = 600;

                if (bs.utils.isElement(_constants.canvas.node)) {
                    _constants.canvas.size.width = _constants.canvas.node.scrollWidth;
                    _constants.canvas.size.height = _constants.canvas.node.scrollHeight;
                }

                _constants.orientation = {};
                _constants.orientation.vertical = "VERTICAL";
                _constants.orientation.horizontal = "HORIZONTAL";

                _constants.colors = {};
                _constants.colors.red = "#FF5E5B";
                _constants.colors.white = "#F8F8FF";
                _constants.colors.black = "#36393B";

                _constants.line = {};
                _constants.line.count = 11;
                _constants.line.size = {};
                _constants.line.size.width = (_constants.canvas.size.width / _constants.line.count);
                _constants.line.size.height = (_constants.canvas.size.height / _constants.line.count);

                _constants.map = {};
                _constants.map.gap = 1;
                _constants.map.indexes = {};
                _constants.map.indexes.vertical = "A,B,C,D,E,F,G,H,I,J".split(",");
                _constants.map.indexes.horizontal = "1,2,3,4,5,6,7,8,9,10".split(",");

                if (_game.hasDebugEnabled()) {
                    _constants.map.indexes.vertical = "1,2,3,4,5,6,7,8,9,10".split(",");
                }

                return _instance;
            };

        }

        /**********************************************************************************/
        /*                                                                                */
        /*                               PRIVATE MEMBERS                                  */
        /*                                                                                */
        /**********************************************************************************/

    }

}
