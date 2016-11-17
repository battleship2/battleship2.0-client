/// <reference path="../../bs.ts" />

namespace bs {

    export namespace core {

        let _gui: bs.core.GUI = null;
        let _map: bs.core.Map = null;
        let _game: bs.core.Game = null;
        let _mark: createjs.Bitmap = null;
        let _setup: boolean = false;
        let _ships: Array<bs.ships.AbstractShip> = [];
        let _canvas: JQuery = null;
        let _loader: bs.core.Loader = null;
        let _target: createjs.Bitmap = null;
        let _picture: createjs.Bitmap = null;
        let _instance: bs.core.Board = null;
        let _constants: bs.core.Constants = null;
        let _updateStage: boolean = false;
        let _canvasParent: JQuery = null;
        let _stageChildren: Array<createjs.DisplayObject> = [];
        let _mouseOverArea: createjs.Shape = new createjs.Shape();

        let _redFilter: createjs.ColorFilter = new createjs.ColorFilter(0, 0, 0, 1, 238, 64, 0, 0);
        let _greenFilter: createjs.ColorFilter = new createjs.ColorFilter(0, 0, 0, 1, 0, 139, 69, 0);
        let _blackFilter: createjs.ColorFilter = new createjs.ColorFilter(0, 0, 0, 1, 54, 57, 59, 0);

        export class Board extends bs.core.Core {

            /**********************************************************************************/
            /*                                                                                */
            /*                                  PROPERTIES                                    */
            /*                                                                                */
            /**********************************************************************************/

            public stage: createjs.Stage = null;

            /**********************************************************************************/
            /*                                                                                */
            /*                                  CONSTRUCTOR                                   */
            /*                                                                                */
            /**********************************************************************************/

            constructor() {
                super();

                if (bs.utils.isNull(_instance)) {
                    _instance = this;

                    _gui = new bs.core.GUI();
                    _map = new bs.core.Map();
                    _game = new bs.core.Game();
                    _loader = new bs.core.Loader();
                    _constants = new bs.core.Constants();

                    let canvasNode = _constants.get("canvas").node;
                    _canvas = $(canvasNode);
                    _canvasParent = _canvas.parent();
                    _instance.stage = new createjs.Stage(canvasNode);

                    createjs.Touch.enable(_instance.stage);
                    _instance.stage.enableMouseOver(10);
                    // _instance.stage.mouseMoveOutside = true;
                    _instance.stage.addEventListener("mouseleave", _mouseLeave);
                    _instance.stage.addEventListener("stagemousedown", _mouseDown);
                    _instance.stage.addEventListener("stagemousemove", _mouseMove);

                    createjs.Ticker.addEventListener("tick", _notifyClients);
                }

                return _instance;
            }

            /**********************************************************************************/
            /*                                                                                */
            /*                                PUBLIC MEMBERS                                  */
            /*                                                                                */
            /**********************************************************************************/

            public addShip = (ship: bs.ships.AbstractShip): bs.core.Board => {
                try {
                    let freeCoordinates = _map.getFreeCoordinates(ship.orientation, ship.length);
                    ship.setLocation(freeCoordinates.x, freeCoordinates.y);
                    _ships.push(ship);
                }
                catch (exception) {
                    console.error(exception);
                }
                return _instance;
            };

            public getShips = (): Array<bs.ships.AbstractShip> => {
                return _ships;
            };

            public clearShips = (): bs.core.Board => {
                bs.utils.forEach(_ships, ship => ship.clear());
                return _instance;
            };

            public drawShips = (): bs.core.Board => {
                bs.utils.forEach(_ships, ship => ship.draw());
                return _instance;
            };

            public freezeShips = (): bs.core.Board => {
                bs.utils.forEach(_ships, ship => ship.freeze());
                return _instance;
            };

            public shipMoved = (ship?: bs.ships.AbstractShip): bs.core.Board => {
                bs.utils.forEach(_ships, _ship => _ship.doLocationCheck());
                _instance.requestUpdate();
                return _instance;
            };

            public applyFilterOn = (name: string, template: createjs.Bitmap, update: boolean = true): bs.core.Board => {

                switch (name.toLowerCase()) {
                    case "red":
                        template.filters = [_redFilter];
                        break;
                    case "green":
                        template.filters = [_greenFilter];
                        break;
                    case "black":
                        template.filters = [_blackFilter];
                        break;
                }

                _instance.templateCache(template);

                if (update) {
                    _instance.requestUpdate();
                }

                return _instance;
            };

            public requestUpdate = (): bs.core.Board => {
                _updateStage = true;
                return _instance;
            };

            public notifyOnUpdate = (callback?: Function): Function => {
                return bs.events.on("BS::GRAPHIC::UPDATE", callback);
            };

            public templateCache = (template: createjs.Bitmap): bs.core.Board => {
                if (!bs.utils.isElement(template.image)) {
                    return _instance;
                }

                if (bs.utils.isNull(template.cacheCanvas)) {
                    template.cache(template.x, template.y, template.image.width, template.image.height);
                } else {
                    template.updateCache();
                }

                return _instance;
            };

            public setup = (): bs.core.Board => {
                if (_setup) {
                    console.error("The board has already been setup!");
                    return _instance;
                }

                _setup = true;

                $(window).on("resize", _resize);
                _instance.show();
                _resize();

                _mark = new createjs.Bitmap(_loader.get("MARK"));
                _instance.templateCache(_mark);

                _target = new createjs.Bitmap(_loader.get("TARGET"));
                _instance.templateCache(_target);

                return _instance;
            };

            public show = (): bs.core.Board => {
                if (bs.utils.isElement(_canvas)) {
                    _canvas.removeClass("hidden");
                }
                return _instance;
            };

            public hide = (): bs.core.Board => {
                if (bs.utils.isElement(_canvas)) {
                    _canvas.addClass("hidden");
                }
                return _instance;
            };

            public draw = (): bs.core.Board => {
                if (!_setup) {
                    return _instance;
                }

                _draw();

                if (_game.state() === BSData.Names.PLAYER) {
                    _drawPicture(BSData.Names.PLAYER, 1.4);
                } else {
                    _clearBombSelection();
                    _drawPicture(BSData.Names.MAP, 1.4);
                }

                return _instance;
            };

            public clear = (): bs.core.Board => {
                _clear();
                _clearBombSelection();
                return _instance;
            };

            public reset = (): bs.core.Board => {
                _instance.clear();
                _instance.clearShips();
                _ships = [];
                return _instance;
            };

        }

        /**********************************************************************************/
        /*                                                                                */
        /*                               PRIVATE MEMBERS                                  */
        /*                                                                                */
        /**********************************************************************************/

        function _clearBombSelection(): bs.core.Board {
            _instance.stage.removeChild(_mark);
            _instance.stage.removeChild(_target);
            _instance.stage.removeChild(_mouseOverArea);
            _instance.stage.update();
            return _instance;
        }

        function _drawTargetTemplate(name: string, bitmap: createjs.Bitmap): boolean {
            let rel = _map.relativeToAbsoluteCoordinates(_instance.stage.mouseX, _instance.stage.mouseY);

            if (rel.x <= 0 || rel.y <= 0) {
                return false;
            }

            let abs = _map.absoluteToRelativeCoordinates(rel.x, rel.y),
                _line = _constants.get("line"),
                aspectRatio = bs.utils.getAspectRatioFit(bitmap.image.width, bitmap.image.height, _line.size.width, _line.size.height);

            bitmap.scaleX = bitmap.scaleY = aspectRatio.ratio;

            bitmap.x = abs.x;
            bitmap.y = abs.y;

            if (!bitmap.parent) {
                _instance.stage.addChild(bitmap);
            }

            return true;
        }

        function _mouseLeave(): bs.core.Board {
            if (!_mouseOverArea.parent && !_target.parent) {
                return _instance;
            }
            _instance.stage.removeChild(_target);
            _instance.stage.removeChild(_mouseOverArea);
            _instance.stage.update();
            return _instance;
        }

        function _mouseMove(event): bs.core.Board {
            if (!_game.hasStarted() || _game.state() !== BSData.Names.PLAYER) {
                return _instance;
            }

            if (!_drawTargetTemplate("TARGET", _target)) {
                return _instance;
            }

            let rel = _map.relativeToAbsoluteCoordinates(_instance.stage.mouseX, _instance.stage.mouseY),
                abs = _map.absoluteToRelativeCoordinates(rel.x, rel.y),
                _line = _constants.get("line");

            _mouseOverArea.graphics.clear();

            _mouseOverArea
                .graphics
                .setStrokeStyle(1)
                .beginFill(_constants.get("colors").white)
                .drawRect(abs.x, abs.y, _line.size.width, _line.size.height)
                .endFill();

            _mouseOverArea.alpha = .5;
            _mouseOverArea.cursor = "pointer";

            if (!_mouseOverArea.parent) {
                _instance.stage.addChild(_mouseOverArea);
            }

            _instance.stage.update(event);

            return _instance;
        }

        function _mouseDown(event): bs.core.Board {
            if (!_game.hasStarted() || _game.state() !== BSData.Names.PLAYER) {
                return _instance;
            }

            console.info("TODO: Check here that the coords have not already been hit (from map?)");

            _drawTargetTemplate("MARK", _mark);

            _instance.stage.update(event);

            let rel = _map.relativeToAbsoluteCoordinates(_instance.stage.mouseX, _instance.stage.mouseY),
                abs = _map.absoluteToRelativeCoordinates(rel.x, rel.y);

            _gui.bombLocationSelected(abs.x, abs.y);

            // bs.events.broadcast(_enum.events.bomb.selected, abs);

            return _instance;
        }

        function _notifyClients(event: Event): bs.core.Board {
            // This set makes it so the stage only re-renders when an event handler indicates a change has happened.
            if (_updateStage) {
                _updateStage = false;
                bs.events.broadcast("BS::GRAPHIC::UPDATE", event);
            }
            return _instance;
        }

        function _draw(): bs.core.Board {
            _constants.update();

            if (_stageChildren.length > 0) {
                _clear();
            }

            // Drawing board
            let _line = _constants.get("line"),
                _map = _constants.get("map"),
                _canvas = _constants.get("canvas"),
                _colors = _constants.get("colors"),
                lineWidth = _line.size.width,
                lineHeight = _line.size.height;

            for (let index = 0; index < _line.count; ++index) {

                let lineShape = new createjs.Shape(),
                    rectShape = new createjs.Shape(),
                    currentVerticalPosition = (index * lineWidth),
                    currentHorizontalPosition = (index * lineHeight);

                // Drawing grid lines
                lineShape
                    .graphics
                    .setStrokeStyle(.2)

                    // Vertical line
                    .beginStroke(_colors.black)
                    .moveTo(currentVerticalPosition, 0)
                    .lineTo(currentVerticalPosition, _canvas.size.width)
                    .endStroke()

                    // Horizontal line
                    .beginStroke(_colors.black)
                    .moveTo(0, currentHorizontalPosition)
                    .lineTo(_canvas.size.height, currentHorizontalPosition)
                    .endStroke();

                // Drawing grid indexes
                rectShape
                    .graphics

                    // Vertical index
                    .beginFill(_colors.black)
                    .drawRect(currentVerticalPosition, 0, lineWidth, lineHeight)
                    .endFill()

                    // Horizontal index
                    .beginFill(_colors.black)
                    .drawRect(0, currentHorizontalPosition, lineWidth, lineHeight)
                    .endFill();

                _stageChildren.push(lineShape);
                _stageChildren.push(rectShape);
                _instance.stage.addChild(lineShape);
                _instance.stage.addChild(rectShape);

                // Drawing indexes text
                if (index > 0) {

                    let textScale = (lineWidth / 2),
                        verticalText = _map.indexes.vertical[index - 1],
                        horizontalText = _map.indexes.horizontal[index - 1],
                        verticalIndexText = new createjs.Text(verticalText, textScale + "px Arial", _colors.white),
                        horizontalIndexText = new createjs.Text(horizontalText, textScale + "px Arial", _colors.white);

                    verticalIndexText.x = (currentVerticalPosition + lineWidth / 2 - verticalIndexText.getBounds().width / 2);
                    verticalIndexText.y = (lineHeight / 2);
                    verticalIndexText.textBaseline = "middle";

                    horizontalIndexText.x = (lineWidth / 2 - horizontalIndexText.getBounds().width / 2);
                    horizontalIndexText.y = (currentHorizontalPosition + lineHeight / 2);
                    horizontalIndexText.textBaseline = "middle";

                    _stageChildren.push(verticalIndexText);
                    _stageChildren.push(horizontalIndexText);
                    _instance.stage.addChild(verticalIndexText);
                    _instance.stage.addChild(horizontalIndexText);

                }

            }

            _instance.stage.update();

            return _instance;
        }

        function _clear() {
            bs.utils.forEach(_stageChildren, child => _instance.stage.removeChild(child));
            _stageChildren = [];
            _instance.stage.update();
            return _instance;
        }

        function _drawPicture(name: string, scale: number = 1): bs.core.Board {
            if (!bs.utils.isNull(_picture) && bs.utils.isDefined(_picture.parent)) {
                _instance.stage.removeChild(_picture);
                _stageChildren.splice(_stageChildren.indexOf(_picture));
            }

            _picture = _getBitmapPictureOf(name, scale);
            _stageChildren.push(_picture);
            _instance.stage.addChild(_picture);
            _instance.stage.update();

            return _instance;
        }

        function _getBitmapPictureOf(name: string, scale: number = 1): createjs.Bitmap {
            let bitmap = new createjs.Bitmap(_loader.get(name)),
                _line = _constants.get("line"),
                lineWidth = _line.size.width,
                lineHeight = _line.size.height,
                logoScale = (lineWidth / bitmap.image.width) / scale;

            bitmap.x = bitmap.y = (lineWidth - bitmap.image.width * logoScale) / 2;
            bitmap.scaleX = bitmap.scaleY = logoScale;

            return bitmap;
        }

        function _resize(): bs.core.Board {
            let _width = _canvasParent.width();
            let _height = _canvasParent.height();
            let size = Math.min(_width, _height);

            (<HTMLCanvasElement>_instance.stage.canvas).width = size;
            (<HTMLCanvasElement>_instance.stage.canvas).height = size;

            _instance.draw();

            bs.events.broadcast("BS::BOARD::RESIZED");

            return _instance;
        }

    }

}
