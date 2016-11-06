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

declare function randomColor(options: any): string;
declare function moment(date: any);

/**********************************************************************************/
/*                                                                                */
/*                                    INTERFACES                                  */
/*                                                                                */
/**********************************************************************************/

interface Hint {
    body: string;
    title: string;
}

interface Message {
    id: string;
    date: string;
    message: string;
    nickname: string;
}

/**********************************************************************************/
/*                                                                                */
/*                                    REGISTRIES                                  */
/*                                                                                */
/**********************************************************************************/
