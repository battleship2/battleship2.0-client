/// <reference path="../../bs.ts" />

namespace bs {

    export namespace exceptions {

        export class BSInvalidCoordinatesException extends bs.exceptions.BSFactoryException {

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

            /**
             * @name BSInvalidCoordinatesException
             * @kind Exception
             *
             * @description
             * Use this exception when invalid coordinates are spotted to be read or written on the map.
             *
             * @param {Number} x The x coordinate.
             * @param {Number} y The y coordinate.
             */
            constructor(x: number, y: number) {
                super();
                this.name = "BSInvalidCoordinatesException";
                this.stack = (new Error()).stack;
                this.toString = function () { return this.name + ": " + this.message; };
                this.message = "Encountered invalid coordinates";

                if (bs.utils.isNumber(x) && bs.utils.isNumber(y)) {
                    this.message = "Encountered invalid coordinates: (" + x + ", " + y + ")";
                }
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

    }

}
