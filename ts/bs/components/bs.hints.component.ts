/// <reference path="../../bs.ts" />

namespace bs {

    export namespace components {

        let _hint: {title: string, body: string} = {title: "", body: ""};
        let _$hints: JQuery = null;
        let _$hintsBody: JQuery = null;
        let _$hintsTitle: JQuery = null;

        export class Hints extends bs.core.Core {

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

            constructor(element: string) {
                super();

                _$hints = $(element);
                _$hintsBody = _$hints.find(".hints-body");
                _$hintsTitle = _$hints.find(".hints-title");
            }

            /**********************************************************************************/
            /*                                                                                */
            /*                                PUBLIC MEMBERS                                  */
            /*                                                                                */
            /**********************************************************************************/

            public show = (title: string, body: string) : this => {
                _hint.body = body;
                _hint.title = title;

                _update();
                _$hints.removeClass("hidden");

                return this;
            };

            public clear = () : this => {
                _hint.body = "";
                _hint.title = "";
                _update();
                _$hints.addClass("hidden");
                return this;
            };

            public isVisible = () : boolean => {
                return !_$hints.hasClass("hidden");
            };

        }

        /**********************************************************************************/
        /*                                                                                */
        /*                               PRIVATE MEMBERS                                  */
        /*                                                                                */
        /**********************************************************************************/

        function _update() {
            _$hintsBody.html(_hint.body);
            _$hintsTitle.html(_hint.title);
        }

    }

}
