describeLogic('bs.map.core', function () {

    var map = new bs.core.Map(),
        board = new bs.core.Board(),
        constants = new bs.core.Constants(),
        orientation = constants.get('orientation'),
        ship = new bs.ships.AbstractShip('LITTLE_SHIP', 1);

    describeLogicPoint('logic', function () {

        var anotherShip = null;

        beforeEach(function () {
            anotherShip = new bs.ships.AbstractShip('HEY_HO', 4);
            board.addShip(ship);
            board.addShip(anotherShip);
        });

        afterEach(function () {
            board.reset();
        });

        it('should find a ship given its coordinates', function () {
            ship.length = 3;
            ship.orientation = orientation.horizontal;
            ship.setLocation(2, 2);

            anotherShip.length = 5;
            anotherShip.orientation = orientation.vertical;
            anotherShip.setLocation(4, 1);

            expect(map.getShipsAt(1, 1).length).toBe(0);
            expect(map.getShipsAt(2, 2).length).toBe(1);
            expect(map.getShipsAt(4, 2).length).toBe(2);
        });

    });

    describeLogicPoint('horizontal placement', function () {

        beforeEach(function () {
            ship.length = 1;
            ship.location.y = 4;
            ship.orientation = orientation.horizontal;
        });

        it('should have X superior or equal to zero', function () {
            ship.location.x = -1;
            expect(map.isShipLocationValid(ship)).toBeFalsy();

            ship.location.x = 1;
            expect(map.isShipLocationValid(ship)).toBeTruthy();
        });

        it('should not exceed map length', function () {
            ship.location.x = 11;
            expect(map.isShipLocationValid(ship)).toBeFalsy();

            ship.location.x = 1;
            expect(map.isShipLocationValid(ship)).toBeTruthy();

            ship.location.x = 10;
            expect(map.isShipLocationValid(ship)).toBeTruthy();

            ship.length = 3;
            expect(map.isShipLocationValid(ship)).toBeFalsy();

            ship.location.x = 6;
            expect(map.isShipLocationValid(ship)).toBeTruthy();
        });

    });

    describeLogicPoint('vertical placement', function () {

        beforeEach(function () {
            ship.length = 1;
            ship.location.x = 4;
            ship.orientation = orientation.vertical;
        });

        it('should have y-axis superior or equal to 1', function () {
            ship.location.y = -1;
            expect(map.isShipLocationValid(ship)).toBeFalsy();

            ship.location.y = 1;
            expect(map.isShipLocationValid(ship)).toBeTruthy();
        });

        it('should not exceed map height', function () {
            ship.location.y = 11;
            expect(map.isShipLocationValid(ship)).toBeFalsy();

            ship.location.y = 1;
            expect(map.isShipLocationValid(ship)).toBeTruthy();

            ship.location.y = 10;
            expect(map.isShipLocationValid(ship)).toBeTruthy();

            ship.length = 3;
            expect(map.isShipLocationValid(ship)).toBeFalsy();

            ship.location.y = 6;
            expect(map.isShipLocationValid(ship)).toBeTruthy();
        });

    });

    describeLogicPoint('placement on map', function () {

        var anotherShip = null;

        beforeEach(function () {
            ship.length = 1;
            ship.orientation = orientation.horizontal;
            anotherShip = new bs.ships.AbstractShip('A_SHIP', 1);
            anotherShip.location.x = 4;
            anotherShip.location.y = 4;
            anotherShip.orientation = orientation.horizontal;

            board.addShip(ship);
            board.addShip(anotherShip);
        });

        afterEach(function () {
            board.reset();
        });

        it("should be valid if there is no ship yet on the map", function () {
            expect(map.isShipLocationValid(ship)).toBeTruthy();
        });

        it("shouldn't be valid if a 1x1 ship overlaps another 1x1 ship", function () {
            anotherShip.length = 1;
            ship.setLocation(anotherShip.x, anotherShip.y);

            expect(map.isShipLocationValid(ship)).toBeFalsy();
        });

        it("shouldn't be valid if 1x1 ship overlap a 4x1 ship", function () {
            anotherShip.length = 4;
            anotherShip.orientation = orientation.horizontal;

            ship.setLocation(anotherShip.x, anotherShip.y);
            expect(map.isShipLocationValid(ship)).toBeFalsy();

            ship.setLocation(anotherShip.x + 1, anotherShip.y);
            expect(map.isShipLocationValid(ship)).toBeFalsy();

            ship.setLocation(anotherShip.x + 2, anotherShip.y);
            expect(map.isShipLocationValid(ship)).toBeFalsy();

            ship.setLocation(anotherShip.x + 3, anotherShip.y);
            expect(map.isShipLocationValid(ship)).toBeFalsy();
        });

        it("shouldn't be valid if 1x1 ship overlap a 1x4 ship", function () {
            anotherShip.length = 4;
            anotherShip.orientation = orientation.vertical;

            ship.setLocation(anotherShip.x, anotherShip.y);
            expect(map.isShipLocationValid(ship)).toBeFalsy();

            ship.setLocation(anotherShip.x, anotherShip.y + 1);
            expect(map.isShipLocationValid(ship)).toBeFalsy();

            ship.setLocation(anotherShip.x, anotherShip.y + 2);
            expect(map.isShipLocationValid(ship)).toBeFalsy();

            ship.setLocation(anotherShip.x, anotherShip.y + 3);
            expect(map.isShipLocationValid(ship)).toBeFalsy();
        });

        it("should be valid if 1x1 ship doesn't overlap any other ship", function () {
            anotherShip.length = 3;
            anotherShip.location.x = 2;
            anotherShip.location.y = 2;
            anotherShip.orientation = orientation.horizontal;

            ship.setLocation(1, 2);
            expect(map.isShipLocationValid(ship)).toBeTruthy();

            ship.setLocation(8, 8);
            expect(map.isShipLocationValid(ship)).toBeTruthy();

            ship.setLocation(2, 1);
            expect(map.isShipLocationValid(ship)).toBeTruthy();

            ship.setLocation(5, 2);
            expect(map.isShipLocationValid(ship)).toBeTruthy();
        });

    });

});
