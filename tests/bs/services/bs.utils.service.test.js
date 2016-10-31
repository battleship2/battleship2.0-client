describeLogic('bs.utils.service', function() {

    var objA, objB, objC, arrA, arrB, itemsA, itemsB;

    beforeEach(function () {
        objA = { a: 'A' };
        objB = { b: 'B' };
        objC = { c: 'C', d: objA };
        arrA = [ objA ];
        arrB = [ objB ];
        itemsA = { a: 'A', b: 'B', c: 'C' };
        itemsB = [ 0, 'a', new Date().toJSON(), null ];
    });

    it('UUID', function () {
        var uuid0 = bs.utils.uuid(),
            uuid1 = bs.utils.uuid();

        expect(uuid0.length).toEqual(uuid1.length);
        expect(uuid0).not.toEqual(uuid1);
    });

    it('isDate', function () {
        expect(bs.utils.isDate(0)).toBeFalsy();
        expect(bs.utils.isDate(new Date())).toBeTruthy();
    });

    it('isNull', function () {
        expect(bs.utils.isNull(0)).toBeFalsy();
        expect(bs.utils.isNull(null)).toBeTruthy();
    });

    it('isArray', function () {
        expect(bs.utils.isArray({})).toBeFalsy();
        expect(bs.utils.isArray([])).toBeTruthy();
    });

    it('isString', function () {
        expect(bs.utils.isString(0)).toBeFalsy();
        expect(bs.utils.isString('0')).toBeTruthy();
    });

    it('isRegExp', function () {
        expect(bs.utils.isRegExp(0)).toBeFalsy();
        expect(bs.utils.isRegExp(new RegExp(/0/gi))).toBeTruthy();
    });

    it('isObject', function () {
        expect(bs.utils.isObject(null)).toBeFalsy();
        expect(bs.utils.isObject({})).toBeTruthy();
    });

    it('isNumber', function () {
        expect(bs.utils.isNumber('0')).toBeFalsy();
        expect(bs.utils.isNumber(0)).toBeTruthy();
    });

    it('isDefined', function () {
        expect(bs.utils.isDefined(undefined)).toBeFalsy();
        expect(bs.utils.isDefined(0)).toBeTruthy();
    });

    it('isElement', function () {
        expect(bs.utils.isElement(0)).toBeFalsy();
        expect(bs.utils.isElement(document.createElement('p'))).toBeTruthy();
    });

    it('isFunction', function () {
        expect(bs.utils.isFunction(0)).toBeFalsy();
        expect(bs.utils.isFunction(describeLogic)).toBeTruthy();
    });

    it('isUndefined', function () {
        expect(bs.utils.isUndefined(0)).toBeFalsy();
        expect(bs.utils.isUndefined(undefined)).toBeTruthy();
    });

    it('merge', function () {
        expect(bs.utils.merge({}, objA, objB)).toEqual({a: 'A', b: 'B'});
        expect(bs.utils.merge({}, objC)).toEqual({c: 'C', d: {a: 'A'}});
        expect(bs.utils.merge([], arrA, arrB)).toEqual([{a: 'A', b: 'B'}]);
    });

    it('extend', function () {
        expect(bs.utils.extend({}, objA, objB)).toEqual({a: 'A', b: 'B'});
        expect(bs.utils.extend({}, objC)).toEqual({c: 'C', d: {a: 'A'}});
        expect(bs.utils.extend([], arrA, arrB)).toEqual([{b: 'B'}]);
    });

    it('forEach', function () {
        bs.utils.forEach(itemsA, function (item, index) {
            expect(itemsA.hasOwnProperty(index)).toBeTruthy();
            expect(item).toEqual(itemsA[index]);
        });

        bs.utils.forEach(itemsB, function (item, index) {
            expect(index).not.toBeLessThan(0);
            expect(index).toBeLessThan(itemsB.length);
            expect(item).toEqual(itemsB[index]);
        });
    });

});
