/// <reference path="../../bs.ts" />

namespace bs {

    export namespace events {

        /**********************************************************************************/
        /*                                                                                */
        /*                                  PROPERTIES                                    */
        /*                                                                                */
        /**********************************************************************************/

        let _listeners: {} = {};

        /**********************************************************************************/
        /*                                                                                */
        /*                               PUBLIC FUNCTIONS                                 */
        /*                                                                                */
        /**********************************************************************************/

        export function on(name: string, listener: Function) {

            if (!bs.utils.isFunction(listener)) {
                return;
            }

            let namedListeners = _listeners[name];
            if (!namedListeners) {
                _listeners[name] = namedListeners = [];
            }
            namedListeners.push(listener);

            return function _off() {
                let indexOfListener = namedListeners.indexOf(listener);
                if (indexOfListener !== -1) {
                    namedListeners.splice(indexOfListener, 1);
                }
            };

        }

        export function flush() {
            _listeners = {};
        }

        export function get(name?: string) {
            return _listeners[name] || _listeners;
        }

        export function broadcast(name: string, args?: any) {

            let namedListeners = _listeners[name];
            if (!namedListeners) return;

            bs.utils.forEach(namedListeners, function (listener) {
                try {
                    if (bs.utils.isUndefined(args)) {
                        listener.apply(null);
                    } else {
                        listener.apply(null, [args]);
                    }
                }
                catch (exception) { bs.utils.handleException(exception); }
            });

        }

        /**********************************************************************************/
        /*                                                                                */
        /*                              PRIVATE FUNCTIONS                                 */
        /*                                                                                */
        /**********************************************************************************/

    }

}
