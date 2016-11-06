/// <reference path="../../bs.ts" />

namespace bs {

    export namespace components {

        export class Hints extends bs.core.Core {

            /**********************************************************************************/
            /*                                                                                */
            /*                                  PROPERTIES                                    */
            /*                                                                                */
            /**********************************************************************************/

            private _hint: Hint = { title: "", body: "" };
            private _$hints: JQuery = null;
            private _$hintsBody: JQuery = null;
            private _$hintsTitle: JQuery = null;

            /**********************************************************************************/
            /*                                                                                */
            /*                                  CONSTRUCTOR                                   */
            /*                                                                                */
            /**********************************************************************************/

            constructor(element: string) {
                super();

                this._$hints = $(element);
                this._$hintsBody = this._$hints.find(".hints-body");
                this._$hintsTitle = this._$hints.find(".hints-title");
            }

            /**********************************************************************************/
            /*                                                                                */
            /*                                PUBLIC MEMBERS                                  */
            /*                                                                                */
            /**********************************************************************************/

            public show = (title: string, body: string) : bs.components.Hints => {
                this._hint.body = body;
                this._hint.title = title;
                _update.call(this);
                this._$hints.removeClass("hidden");
                return this;
            };

            public clear = () : bs.components.Hints => {
                this._hint.body = "";
                this._hint.title = "";
                _update.call(this);
                this._$hints.addClass("hidden");
                return this;
            };

            public isVisible = () : boolean => {
                return !this._$hints.hasClass("hidden");
            };

        }

        /**********************************************************************************/
        /*                                                                                */
        /*                               PRIVATE MEMBERS                                  */
        /*                                                                                */
        /**********************************************************************************/

        function _update(): bs.components.Hints {
            this._$hintsBody.html(this._hint.body);
            this._$hintsTitle.html(this._hint.title);
            return this;
        }

    }

}
