describeLogic('bs.board.core', function () {

    var board = new bs.core.Board(),
        ship = new bs.ships.AbstractShip('LITTLE_SHIP', 1);

    describeLogicPoint('ship logic', function () {

        beforeEach(function () {});

        afterEach(function () {
            board.reset();
        });

        it('should store the ships', function () {
            board.addShip(ship);

            var ships = board.getShips();

            expect(ships.length).toEqual(1);
            expect(ships).toEqual([ship]);
        });

        it('should remove the ships on demand', function () {
            board.addShip(ship);
            board.reset();

            var ships = board.getShips();

            expect(ships.length).toEqual(0);
        });

    });

});
