/* tslint:disable:no-unused-variable */

import * as utils from './utils';

describe('Core: utils', () => {

  let objA: any;
  let objB: any;
  let objC: any;
  let arrA: any;
  let arrB: any;
  let itemsA: any;
  let itemsB: any;

  beforeEach(() => {
    objA = { a: 'A' };
    objB = { b: 'B' };
    objC = { c: 'C', d: objA };
    arrA = [ objA ];
    arrB = [ objB ];
    itemsA = { a: 'A', b: 'B', c: 'C' };
    itemsB = [ 0, 'a', new Date().toJSON(), null ];
  });

  it('cssRuleExists', () => {
    const style = document.createElement('style');
    style.innerHTML = '.myClass { color: #F00; }';
    document.head.appendChild(style);

    expect(true).toBeTruthy();

    expect(utils.cssRuleExists('falseClass')).toBeFalsy();
    expect(utils.cssRuleExists('myClass')).toBeTruthy();
  });

  it('UUID', () => {
    const uuid0 = utils.UUID();
    const uuid1 = utils.UUID();

    expect(uuid0.length).toEqual(uuid1.length);
    expect(uuid0).not.toEqual(uuid1);
  });

  it('isDate', () => {
    expect(utils.isDate(0)).toBeFalsy();
    expect(utils.isDate(new Date())).toBeTruthy();
  });

  it('isNull', () => {
    expect(utils.isNull(0)).toBeFalsy();
    expect(utils.isNull(null)).toBeTruthy();
  });

  it('isArray', () => {
    expect(utils.isArray({})).toBeFalsy();
    expect(utils.isArray([])).toBeTruthy();
  });

  it('isString', () => {
    expect(utils.isString(0)).toBeFalsy();
    expect(utils.isString('0')).toBeTruthy();
  });

  it('isRegExp', () => {
    expect(utils.isRegExp(0)).toBeFalsy();
    expect(utils.isRegExp(new RegExp(/0/gi))).toBeTruthy();
  });

  it('isObject', () => {
    expect(utils.isObject(null)).toBeFalsy();
    expect(utils.isObject({})).toBeTruthy();
  });

  it('isNumber', () => {
    expect(utils.isNumber('0')).toBeFalsy();
    expect(utils.isNumber(0)).toBeTruthy();
  });

  it('isDefined', () => {
    expect(utils.isDefined(undefined)).toBeFalsy();
    expect(utils.isDefined(0)).toBeTruthy();
  });

  it('isElement', () => {
    expect(utils.isElement(0)).toBeFalsy();
    expect(utils.isElement(document.createElement('p'))).toBeTruthy();
  });

  it('isFunction', () => {
    expect(utils.isFunction(0)).toBeFalsy();
    expect(utils.isFunction(() => {
    })).toBeTruthy();
  });

  it('isUndefined', () => {
    expect(utils.isUndefined(0)).toBeFalsy();
    expect(utils.isUndefined(undefined)).toBeTruthy();
  });

  it('merge', () => {
    expect(utils.merge({}, objA, objB)).toEqual({ a: 'A', b: 'B' });
    expect(utils.merge({}, objC)).toEqual({ c: 'C', d: { a: 'A' } });
    expect(utils.merge([], arrA, arrB)).toEqual([ { a: 'A', b: 'B' } ]);
  });

  it('extend', () => {
    expect(utils.extend({}, objA, objB)).toEqual({ a: 'A', b: 'B' });
    expect(utils.extend({}, objC)).toEqual({ c: 'C', d: { a: 'A' } });
    expect(utils.extend([], arrA, arrB)).toEqual([ { b: 'B' } ]);
  });

  it('forEach', () => {
    utils.forEach(itemsA, (item: any, index: any) => {
      expect(itemsA.hasOwnProperty(index)).toBeTruthy();
      expect(item).toEqual(itemsA[ index ]);
    });

    utils.forEach(itemsB, (item: any, index: any) => {
      expect(index).not.toBeLessThan(0);
      expect(index).toBeLessThan(itemsB.length);
      expect(item).toEqual(itemsB[ index ]);
    });
  });
});
