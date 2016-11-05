/// <reference path="../../bs.ts" />

namespace bs {

    export namespace components {

        let _template: string = "<span class=\"current top <%= currentSize %>\"><%= count %></span><span class=\"next top <%= nextSize %>\"><%= nextCount %></span><span class=\"current bottom <%= currentSize %>\"><%= count %></span><span class=\"next bottom <%= nextSize %>\"><%= nextCount %></span>";
        let _animationEnd: string = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend";

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

                this._count = count;
                this._$element = $(element);
                this.setTemplate();
            }

            /**********************************************************************************/
            /*                                                                                */
            /*                                PUBLIC MEMBERS                                  */
            /*                                                                                */
            /**********************************************************************************/

            public update = () : this => {
                this.setTemplate();
                return this.animate();
            };

            public animate = () : this => {
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

            public increment = () : this => {
                this.update();
                this._count += 1;
                return this;
            };

            public setTemplate = () : this => {
                this._nextSize = this.getSize(this._count + 1);
                this._currentSize = this.getSize(this._count);

                this._$element
                    .html(this._getTemplate())
                    .addClass("up")
                    .removeClass("changed");
                return this;
            };

            public getSize = (count: number) : string => {
                return count > 9 ? "small" : "";
            };

            private _getTemplate = (): string => {
                return _template.replace(/<%= count %>/g, String(this._count))
                    .replace(/<%= nextSize %>/g, this._nextSize)
                    .replace(/<%= nextCount %>/g, String(this._count + 1))
                    .replace(/<%= currentSize %>/g, this._currentSize);
            }

        }

        /**********************************************************************************/
        /*                                                                                */
        /*                               PRIVATE MEMBERS                                  */
        /*                                                                                */
        /**********************************************************************************/



    }

}
