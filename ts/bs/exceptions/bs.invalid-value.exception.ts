/// <reference path="../../bs.ts" />

namespace bs {

    export namespace exceptions {

        export class BSInvalidValueException extends bs.exceptions.BSFactoryException {

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
             * @name BSInvalidValueException
             * @kind Exception
             *
             * @description
             * Use this exception when the value of a property is not matching required specifications.
             *
             * @param {*} value The invalid property"s value.
             * @param {String} property The invalid property"s name.
             */
            constructor(value: any, property: string) {
                super();
                this.name = "BSInvalidValueException";
                this.stack = (new Error()).stack;
                this.toString = function () { return this.name + ": " + this.message; };
                this.message = "Encountered invalid value: " + value;

                if (bs.utils.isString(property) && property.trim().length) {
                    this.message = "Property `" + property + "` has an invalid value: `" + value + "`";
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
