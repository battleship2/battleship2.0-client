/**********************************************************************************/
/*                                                                                */
/*                                    LIBRARIES                                   */
/*                                                                                */
/**********************************************************************************/

/// <reference path="../../../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../../../node_modules/@types/createjs/index.d.ts" />
/// <reference path="../../../node_modules/@types/socket.io-client/index.d.ts" />
/// <reference path="../../../bower_components/moment/moment.d.ts" />

/**********************************************************************************/
/*                                                                                */
/*                                    OVERRIDES                                   */
/*                                                                                */
/**********************************************************************************/

declare interface JQueryStatic {
    throttle(delay: number, callback: Function): Function;
    debounce(delay: number, callback: Function): Function;
}

declare function moment(date: any);
declare function randomColor(options: any): string;

/**********************************************************************************/
/*                                                                                */
/*                                    INTERFACES                                  */
/*                                                                                */
/**********************************************************************************/

interface Hint {
    body: string;
    title: string;
}

interface People {
    id: string;
    nickname: string;
}

interface Message extends People {
    date: string;
    message: string;
}

/**********************************************************************************/
/*                                                                                */
/*                                    REGISTRIES                                  */
/*                                                                                */
/**********************************************************************************/
