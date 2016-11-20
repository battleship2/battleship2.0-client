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

declare namespace createjs {
    interface Bitmap {
        offset: {
            x: number;
            y: number;
        };
    }
}

declare namespace vizhash {
    function supportCanvas(): boolean;
    function canvasHash(hash: string, width: number, height: number): { canvas: HTMLCanvasElement };
}

declare interface JQuery {
    tooltip();
    animateCss(className: string, callback?: Function);
}

declare interface JQueryStatic {
    _data(element: HTMLElement, type: string);
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
