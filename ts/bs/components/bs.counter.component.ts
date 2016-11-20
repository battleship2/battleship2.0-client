/// <reference path="../../bs.ts" />

namespace bs {

    export namespace components {

        let _template: Function = null;

        const _animationEnd: string = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend";

        export class Counter extends bs.core.Core {

            /**********************************************************************************/
            /*                                                                                */
            /*                                  PROPERTIES                                    */
            /*                                                                                */
            /**********************************************************************************/

            private _count: number = 0;
            private _nextSize: string = "";
            private _$element: JQuery = null;
            private _currentSize: string = "";

            /**********************************************************************************/
            /*                                                                                */
            /*                                  CONSTRUCTOR                                   */
            /*                                                                                */
            /**********************************************************************************/

            constructor(count: number = 0, element: string = "") {
                super();

                _template = bs.template.get("counter");

                this._count = count;
                this._$element = $(element);
                this.setTemplate();
            }

            /**********************************************************************************/
            /*                                                                                */
            /*                                PUBLIC MEMBERS                                  */
            /*                                                                                */
            /**********************************************************************************/

            public update = (): bs.components.Counter => {
                this.setTemplate();
                return this.animate();
            };

            public animate = (): bs.components.Counter => {
                setTimeout(() => {
                    this._$element.addClass("changing")
                        .one(_animationEnd, () => {
                            setTimeout(() => {
                                this._$element.addClass("changed").removeClass("changing");
                            }, 500);
                        });
                }, 200);

                return this;
            };

            public increment = (): bs.components.Counter => {
                this.update();
                this._count += 1;
                return this;
            };

            public setTemplate = (): bs.components.Counter => {
                this._nextSize = this.getSize(this._count + 1);
                this._currentSize = this.getSize(this._count);

                this._$element
                    .html(_getTemplate.call(this))
                    .addClass("up")
                    .removeClass("changed");
                return this;
            };

            public getSize = (count: number): string => {
                return count > 9 ? "small" : "";
            };

        }

        /**********************************************************************************/
        /*                                                                                */
        /*                               PRIVATE MEMBERS                                  */
        /*                                                                                */
        /**********************************************************************************/

        function _getTemplate(): string {
            return _template({
                count: this._count,
                nextSize: this._nextSize,
                nextCount: this._count + 1,
                currentSize: this._currentSize
            });
        }

    }

}
