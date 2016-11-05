/// <reference path="../../bs.ts" />

namespace bs {

    export namespace core {

        let _board: bs.core.Board = null;
        let _instance: bs.core.Map = null;
        let _constants: bs.core.Constants = null;

        export class Map extends bs.core.Core {

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

            constructor() {
                super();

                if (bs.utils.isNull(_instance)) {
                    _instance = this;

                    _board = new bs.core.Board();
                    _constants = new bs.core.Constants();
                }

                return _instance;
            }

            /**********************************************************************************/
            /*                                                                                */
            /*                                PUBLIC MEMBERS                                  */
            /*                                                                                */
            /**********************************************************************************/

            public getShipsAt = (x: number, y: number): Array<bs.ships.AbstractShip> => {
                let _result = [];
                let _orientation = _constants.get("orientation");

                bs.utils.forEach(_board.getShips(), (_ship: bs.ships.AbstractShip) => {

                    let startX = _ship.location.x,
                        endX = (_ship.orientation === _orientation.horizontal ? _ship.location.x + _ship.length - 1 : _ship.location.x),
                        startY = _ship.location.y,
                        endY = (_ship.orientation === _orientation.horizontal ? _ship.location.y : _ship.location.y + _ship.length - 1);

                    if (x >= startX && x <= endX && y >= startY && y <= endY) {
                        _result.push(_ship);
                    }

                });

                return _result;
            };

            public savePlayerBombLocation = (x: number, y: number): bs.core.Map => {
                console.info("TODO: Save player bomb here");
                return _instance;
            };

            public isShipLocationValid = (ship: bs.ships.AbstractShip): boolean => {
                return this.locationIsWithinMap(ship) && !this.overlappingOtherShips(ship);
            };

            public getFreeCoordinates = (orientation: string, length: number): {x: number, y: number} => {
                let _line = _constants.get("line"),
                    _ship = {
                        length: length,
                        orientation: orientation,
                        location: <any>{}
                    };

                do {
                    _ship.location.x = 1 + Math.abs(Math.floor(Math.random() * (_line.count)) - length);
                    _ship.location.y = 1 + Math.abs(Math.floor(Math.random() * (_line.count)) - length);
                } while (!this.isShipLocationValid(<bs.ships.AbstractShip>_ship));

                return {x: _ship.location.x, y: _ship.location.y};
            };

            public locationIsWithinMap = (ship: bs.ships.AbstractShip): boolean => {
                let _orientation = _constants.get("orientation"),
                    max = _constants.get("line").count,
                    vLength = (ship.orientation === _orientation.vertical) ? ship.length : 1,
                    hLength = (ship.orientation === _orientation.horizontal) ? ship.length : 1;

                return ship.location.x >= 1 && ship.location.x + hLength - 1 < max &&
                    ship.location.y >= 1 && ship.location.y + vLength - 1 < max;
            };

            public overlappingOtherShips = (ship: bs.ships.AbstractShip): boolean => {
                let cursor = <any>{},
                    isHorizontal = (ship.orientation === _constants.get("orientation").horizontal);

                try {

                    for (let index = 0; index < ship.length; ++index) {
                        cursor.x = ship.location.x + (isHorizontal ? index : 0);
                        cursor.y = ship.location.y + (isHorizontal ? 0 : index);
                        _validFreeCoordinates(cursor.x, cursor.y, ship);
                    }

                } catch (exception) {
                    return true;
                }

                return false;
            };

            public relativeToAbsoluteCoordinates = (relX: number, relY: number): {x: number, y: number} => {
                let _line = _constants.get("line");

                return {
                    x: Math.floor(relX / _line.size.width),
                    y: Math.floor(relY / _line.size.height)
                };
            };

            public absoluteToRelativeCoordinates = (absX: number, absY: number): {x: number, y: number} => {
                let _line = _constants.get("line");

                return {
                    x: Math.floor(absX * _line.size.width),
                    y: Math.floor(absY * _line.size.height)
                };
            };

        }

        /**********************************************************************************/
        /*                                                                                */
        /*                               PRIVATE MEMBERS                                  */
        /*                                                                                */
        /**********************************************************************************/

        function _validFreeCoordinates(x: number, y: number, ship: bs.ships.AbstractShip): boolean {

            let _line = _constants.get("line");
            if (x < 1 || x > _line.count || y < 1 || y > _line.count) {
                throw new bs.exceptions.BSInvalidCoordinatesException(x, y);
            }

            let _ships = _instance.getShipsAt(x, y);
            if (!_ships.length || (_ships.length === 1 && _ships[0].UUID === ship.UUID)) {
                return true;
            }

            throw new bs.exceptions.BSInvalidCoordinatesException(x, y);

        }

    }

}
