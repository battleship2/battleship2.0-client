/// <reference path="../../bs.ts" />

namespace bs {

    export namespace components {

        let _template: string = '<span class="current top <%= currentSize %>"><%= count %></span><span class="next top <%= nextSize %>"><%= nextCount %></span><span class="current bottom <%= currentSize %>"><%= count %></span><span class="next bottom <%= nextSize %>"><%= nextCount %></span>';
        let _animationEnd: string = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';

        export class Counter extends bs.core.Core {

            /**********************************************************************************/
            /*                                                                                */
            /*                                  PROPERTIES                                    */
            /*                                                                                */
            /**********************************************************************************/

            public count: number = 0;
            public nextSize: string = '';
            public $element: JQuery = null;
            public currentSize: string = '';

            /**********************************************************************************/
            /*                                                                                */
            /*                                  CONSTRUCTOR                                   */
            /*                                                                                */
            /**********************************************************************************/

            constructor(count: number = 0, element: string = '') {
                super();

                this.count = count;
                this.$element = $(element);
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
                    this.$element.addClass('changing')
                        .one(_animationEnd, () => {
                            setTimeout(() => {
                                this.$element.addClass('changed').removeClass('changing');
                            }, 500);
                        });
                }, 200);

                return this;
            };

            public increment = () : this => {
                this.update();
                this.count += 1;
                return this;
            };

            public setTemplate = () : this => {
                this.nextSize = this.getSize(this.count + 1);
                this.currentSize = this.getSize(this.count);

                this.$element
                    .html(this._getTemplate())
                    .addClass('up')
                    .removeClass('changed');
                return this;
            };

            public getSize = (count: number) : string => {
                return count > 9 ? 'small' : '';
            };

            private _getTemplate = (): string => {
                return _template.replace(/<%= count %>/g, String(this.count))
                    .replace(/<%= nextSize %>/g, this.nextSize)
                    .replace(/<%= nextCount %>/g, String(this.count + 1))
                    .replace(/<%= currentSize %>/g, this.currentSize);
            }

        }

        /**********************************************************************************/
        /*                                                                                */
        /*                               PRIVATE MEMBERS                                  */
        /*                                                                                */
        /**********************************************************************************/



    }

}
