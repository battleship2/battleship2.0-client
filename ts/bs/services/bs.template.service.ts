/// <reference path="../../bs.ts" />

namespace bs {

    export namespace template {

        /**********************************************************************************/
        /*                                                                                */
        /*                                  PROPERTIES                                    */
        /*                                                                                */
        /**********************************************************************************/

        let _templates: { [name: string]: string } = {};

        /**********************************************************************************/
        /*                                                                                */
        /*                               PUBLIC FUNCTIONS                                 */
        /*                                                                                */
        /**********************************************************************************/

        export function register(name: string, template: string): boolean {
            if (!bs.utils.isString(template)) {
                console.error("(bs.template.register) Trying to register invalid template: [%s] = %s", name, template);
                return false;
            }

            if (bs.utils.isString(_templates[name])) {
                console.error("(bs.template.register) A template named [%s] already exists!", name);
                return false;
            }

            _templates[name] = template;
            return true;
        }

        export function get(name: string): Function | null {
            let template = _templates[name];

            if (!bs.utils.isString(template)) {
                console.error("(bs.template.get) Requesting unknown template: [%s]", name);
                return null;
            }

            return _mapper(template);
        }

        /**********************************************************************************/
        /*                                                                                */
        /*                              PRIVATE FUNCTIONS                                 */
        /*                                                                                */
        /**********************************************************************************/

        function _mapper(template: string): Function {

            return function (data): string {
                let _template = String(template);

                if (bs.utils.isUndefined(data)) {
                    return _template.replace(/{{(.*?)}}/g, "");
                }

                bs.utils.forEach(data, (value: any, key: string) => {
                    _template = _template.replace(new RegExp("{{( *?)" + key + "( *?)}}", "g"), value);
                });

                return _template;
            };

        }

    }

}
