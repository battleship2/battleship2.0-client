/// <reference path="../../bs.ts" />

namespace bs {

    export namespace ships {

        let _map: bs.core.Map = null;
        let _game: bs.core.Game = null;
        let _board: bs.core.Board = null;
        let _frozen: boolean = false;
        let _loader: bs.core.Loader = null;
        let _constants: bs.core.Constants = null;

        export abstract class AbstractShip extends bs.core.Core {

            /**********************************************************************************/
            /*                                                                                */
            /*                                  PROPERTIES                                    */
            /*                                                                                */
            /**********************************************************************************/

            private _debugArea: createjs.Shape = new createjs.Shape();
            private _beingDragged: boolean = false;
            private _updateListener: Function = null;
            private _invalidLocation: boolean = false;
            private _invalidLocationIndicator: createjs.Shape = new createjs.Shape();

            public name: string = 'ABSTRACT_SHIP';
            public scale: number = 0;
            public length: number = 0;
            public template: createjs.Bitmap = null;
            public location: {x: number, y: number} = { x: 1, y: 1 };
            public orientation: string = null;

            /**********************************************************************************/
            /*                                                                                */
            /*                                  CONSTRUCTOR                                   */
            /*                                                                                */
            /**********************************************************************************/

            constructor(name: string = 'ABSTRACT_SHIP', length: number = 0) {
                super();

                _map = new bs.core.Map();
                _game = new bs.core.Game();
                _board = new bs.core.Board();
                _loader = new bs.core.Loader();
                _constants = new bs.core.Constants();

                this.length = length;

                if ((Math.random() * 100) > 50) {
                    this.orientation = _constants.get('orientation').vertical;
                } else {
                    this.orientation = _constants.get('orientation').horizontal
                }

                this.setName(name);
                this.setTemplate(new createjs.Bitmap(_loader.get(name)));
                this.init();
            }

            /**********************************************************************************/
            /*                                                                                */
            /*                                PUBLIC MEMBERS                                  */
            /*                                                                                */
            /**********************************************************************************/

            public setTemplate = (template: createjs.Bitmap = null) : this => {
                if (_frozen) {
                    return this;
                }

                this.template = template;
                this.template.name = this.name;
                this.template.cursor = 'pointer';
                _board.applyFilterOn('black', this.template, false);

                let self = this;
                this.template.on('click',     function (event) { _shipClicked.call(this, event, self); });
                this.template.on('pressup',   function (event) { _shipUnselected.call(this, event, self); });
                this.template.on('rollout',   function (event) { _shipUnhovered.call(this, event, self); });
                this.template.on('rollover',  function (event) { _shipHovered.call(this, event, self); });
                this.template.on('pressmove', function (event) { _shipMoved.call(this, event, self); });
                this.template.on('mousedown', function (event) { _shipSelected.call(this, event, self); });
                _board.templateCache(this.template);

                return this;
            };

            public setName = (name: string) : this => {
                if (_frozen) {
                    return this;
                }

                if (bs.utils.isString(name) && name.length) {
                    this.name = name;
                    if (this.template) {
                        this.template.name = name;
                    }
                }
                return this;
            };

            public isBeingDragged = (beingDragged?: boolean) : boolean => {
                if (bs.utils.isUndefined(beingDragged)) {
                    return this._beingDragged;
                }
                return this._beingDragged = beingDragged;
            };

            public hasValidLocation = () : boolean => {
                return !this._invalidLocation;
            };

            public doLocationCheck = () : this => {
                this.clearLocationCheck();

                if (!_map.isShipLocationValid(this)) {

                    let shipPosition = this.getPosition();

                    this._invalidLocationIndicator
                        .graphics
                        .setStrokeStyle(1)
                        .beginFill(_constants.get('colors').red)
                        .drawRect(shipPosition.x, shipPosition.y, shipPosition.w, shipPosition.h)
                        .endFill();

                    this._invalidLocationIndicator.alpha = .3;

                    if (!this._invalidLocationIndicator.parent) {
                        _board.stage.addChild(this._invalidLocationIndicator);
                    }

                    this.red();
                    this._invalidLocation = true;
                    _board.requestUpdate();

                }

                return this;
            };

            public clearLocationCheck = () : this => {
                if (this._invalidLocation) {
                    this.black();
                    this._invalidLocation = false;
                    this._invalidLocationIndicator.graphics.clear();
                    _board.requestUpdate();
                }
                return this;
            };

            public clear = () : this => {
                this._debugArea.graphics.clear();
                this._invalidLocationIndicator.graphics.clear();
                _board.stage.removeChild(this.template);
                _board.stage.update();
                return this;
            };

            public moveTo = (x: number, y: number) : this => {
                if (_frozen) {
                    return this;
                }

                this.template.x = x;
                this.template.y = y;
                return this;
            };

            public setLocation = (x: number, y: number) : this => {
                if (_frozen) {
                    return this;
                }

                this.location.x = x;
                this.location.y = y;
                return this;
            };

            public debug = () : this => {
                let shipPosition = this.getPosition();

                this._debugArea.graphics.clear();

                this._debugArea
                    .graphics
                    .setStrokeStyle(1)
                    .beginStroke(_constants.get('colors').black)
                    .drawRect(shipPosition.x, shipPosition.y, shipPosition.w, shipPosition.h)
                    .endStroke();

                if (bs.utils.isNull(this._debugArea.parent)) {
                    _board.stage.addChild(this._debugArea);
                }
                return this;
            };

            public rotate = (angle: number = 0, center?: number) : this => {
                if (_frozen) {
                    return this;
                }

                this.template.regX = this.template.image.width / (center || 0) | 0;
                this.template.regY = this.template.image.height / (center || 0) | 0;
                this.template.rotation = (angle || 0);
                return this;
            };

            public init = () : this => {
                if (bs.utils.isFunction(this._updateListener)) {
                    this._updateListener();
                }

                let self = this;
                this._updateListener = _board.notifyOnUpdate(function (event) {
                    self.draw(event);
                });

                return this;
            };

            public getPosition = () : {x: number, y: number, w: number, h: number} => {
                let _line = _constants.get('line');
                let _orientation = _constants.get('orientation');
                return {
                    x: this.location.x * _line.size.width,
                    y: this.location.y * _line.size.height,
                    w: (this.orientation === _orientation.horizontal ? this.length : 1) * _line.size.width,
                    h: (this.orientation === _orientation.vertical   ? this.length : 1) * _line.size.height
                };
            };

            public red = () : this => {
                _board.applyFilterOn('red', this.template);
                return this;
            };

            public green = () : this => {
                _board.applyFilterOn('green', this.template);
                return this;
            };

            public black = () : this => {
                _board.applyFilterOn('black', this.template);
                return this;
            };

            public draw = (event?: Event) : this => {
                let shipPosition = this.getPosition(),
                    aspectRatio = null;

                if(_game.hasDebugEnabled()) {
                    this.debug();
                }

                if (this.orientation === _constants.get('orientation').vertical) {

                    aspectRatio = bs.utils.getAspectRatioFit(this.template.image.height, this.template.image.width, shipPosition.w, shipPosition.h);

                    this.rotate(270, 1);
                    this.moveTo(
                        shipPosition.x + ((shipPosition.w + aspectRatio.width) / 2),
                        shipPosition.y + ((shipPosition.h - aspectRatio.height) / 2)
                    );

                } else {

                    aspectRatio = bs.utils.getAspectRatioFit(this.template.image.width, this.template.image.height, shipPosition.w, shipPosition.h);

                    this.rotate(0);
                    this.moveTo(
                        shipPosition.x + ((shipPosition.w - aspectRatio.width) / 2),
                        shipPosition.y + ((shipPosition.h - aspectRatio.height) / 2)
                    );

                }

                this.setScale(aspectRatio.ratio);

                if (bs.utils.isNull(this.template.parent)) {
                    _board.stage.addChild(this.template);
                }

                _board.stage.update(event);
                return this;
            };

            public setScale = (scale: number) : this => {
                this.scale = this.template.scaleX = this.template.scaleY = scale;
                return this;
            };

            public freeze = () : this => {
                _frozen = true;
                return this;
            }

        }

        /**********************************************************************************/
        /*                                                                                */
        /*                               PRIVATE MEMBERS                                  */
        /*                                                                                */
        /**********************************************************************************/

        function _shipSelected(event: any, ship?: bs.ships.AbstractShip) {
            // IMPORTANT NOTE: The this instance refers to this.template
            if (_frozen) {
                return;
            }

            this.offset = {
                x: this.x - event.stageX,
                y: this.y - event.stageY
            };
        }

        function _shipClicked(event: any, ship?: bs.ships.AbstractShip) {
            // IMPORTANT NOTE: The this instance refers to this.template
            if (_frozen || ship.isBeingDragged()) {
                return;
            }

            let orientation = _constants.get('orientation');

            if (ship.orientation === orientation.vertical) {
                ship.orientation = orientation.horizontal;
            }
            else { ship.orientation = orientation.vertical; }

            _board.shipMoved(ship);
        }

        function _shipMoved(event: any, ship?: bs.ships.AbstractShip) {
            // IMPORTANT NOTE: The this instance refers to this.template
            if (_frozen) {
                return;
            }

            ship.isBeingDragged(true);

            let x = event.stageX + this.offset.x,
                y = event.stageY + this.offset.y,
                abs = _map.relativeToAbsoluteCoordinates(x, y);

            if (ship.location.x !== abs.x || ship.location.y !== abs.y) {

                let _ship = {
                    length: ship.length,
                    location: {
                        x: abs.x,
                        y: abs.y
                    },
                    orientation: ship.orientation
                };

                if (_map.locationIsWithinMap(<bs.ships.AbstractShip>_ship)) {
                    ship.moveTo(x, y);
                    ship.setLocation(abs.x, abs.y);
                    _board.shipMoved(ship);
                }
            }
        }

        function _shipUnselected(event: any, ship?: bs.ships.AbstractShip) {
            // IMPORTANT NOTE: The this instance refers to this.template
            if (_frozen) {
                return;
            }

            ship.isBeingDragged(false);
            _board.shipMoved(ship);
        }

        function _shipHovered(event: any, ship?: bs.ships.AbstractShip) {
            // IMPORTANT NOTE: The this instance refers to this.template
            if (_frozen) {
                return;
            }

            if (ship.hasValidLocation()) {
                ship.green();
            }
        }

        function _shipUnhovered(event: any, ship?: bs.ships.AbstractShip) {
            // IMPORTANT NOTE: The this instance refers to this.template
            if (_frozen) {
                return;
            }

            if (ship.hasValidLocation()) {
                ship.black();
            }
        }

    }

}
