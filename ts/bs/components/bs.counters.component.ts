/// <reference path="../../bs.ts" />

namespace bs {

    export namespace components {

        let _hitCounter: bs.components.Counter = null;
        let _bombCounter: bs.components.Counter = null;
        let _shipDestroyedCounter: bs.components.Counter = null;

        export class Counters extends bs.core.Core {

            /**********************************************************************************/
            /*                                                                                */
            /*                                  PROPERTIES                                    */
            /*                                                                                */
            /**********************************************************************************/

            private _socket: bs.core.Socket = null;
            private _$counters: JQuery = null;

            /**********************************************************************************/
            /*                                                                                */
            /*                                  CONSTRUCTOR                                   */
            /*                                                                                */
            /**********************************************************************************/

            constructor() {
                super();

                this._$counters = $("counters");

                if (this._$counters.length <= 0) {
                    console.error("(bs.counters.component) Missing tag <counters></counters>");
                    return this;
                }

                this._$counters.html(bs.template.get("counters")());

                _hitCounter = new bs.components.Counter(0, "#hits-counter");
                _bombCounter = new bs.components.Counter(0, "#bombs-counter");
                _shipDestroyedCounter = new bs.components.Counter(0, "#ships-destroyed-counter");

                this._socket = new bs.core.Socket();
                console.debug("TODO: (bs.counters.component) Plug hits counter to server response here");
                console.debug("TODO: (bs.counters.component) Plug bombs counter to server response here");
                console.debug("TODO: (bs.counters.component) Plug ships destroyed counter to server response here");
                // bs.events.on(_enum.events.bomb.hit, _hitCounter.increment);
                // bs.events.on(_enum.events.bomb.hit, _bombCounter.increment);
                // bs.events.on(_enum.events.ship.destroyed, _shipDestroyedCounter.increment);
            }

            /**********************************************************************************/
            /*                                                                                */
            /*                                PUBLIC MEMBERS                                  */
            /*                                                                                */
            /**********************************************************************************/

            public showStarterLayout = (): bs.components.Counters => {
                return this;
            };

        }

        /**********************************************************************************/
        /*                                                                                */
        /*                               PRIVATE MEMBERS                                  */
        /*                                                                                */
        /**********************************************************************************/

    }

}
