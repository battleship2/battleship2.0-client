/// <reference path="../../bs.ts" />

namespace bs {

    export namespace exceptions {

        export class BSMissingPropertyException extends bs.exceptions.BSFactoryException {

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
             * @name BSMissingPropertyException
             * @kind Exception
             *
             * @description
             * Use this exception when a property or parameter is missing from a function's call.
             *
             * @param {String} property The missing property's name.
             * @param {Array} requiredProperties Array containing all the required properties for the given call.
             */
            constructor(property: string, requiredProperties?: Array<any>) {
                super();
                this.name = 'BSMissingPropertyException';
                this.stack = (new Error()).stack;
                this.toString = function () { return this.name + ': ' + this.message; };
                this.message = 'A property is missing.';

                if (bs.utils.isString(property) && property.trim().length) {
                    this.message = 'Missing `' + property + '` property.';
                }

                if (bs.utils.isArray(requiredProperties) && requiredProperties.length) {
                    this.message += ' Required properties are: [' + requiredProperties.join(', ') + ']';
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
