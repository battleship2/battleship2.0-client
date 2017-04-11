/**********************************************************************************/
/*                                                                                */
/*                               PUBLIC FUNCTIONS                                 */
/*                                                                                */
/**********************************************************************************/

/**
 * @name emailPattern
 * @kind RegExp
 *
 * @description
 * Email regular expression shared across the application.
 */
export const emailPattern: RegExp =
  /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i;

/**
 * @name passwordPattern
 * @kind RegExp
 *
 * @description
 * Password regular expression shared across the application.
 */
export const passwordPattern: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/g;

/**
 * @name truncate
 * @kind function
 *
 * @description
 * Truncate the given string if needed, and append the given suffix if truncated.
 *
 * @returns {string | null} null if the string was not valid, truncated string otherwise.
 */
export const truncate = (value: string, size: number, suffix?: string): string | null => {
  if (isNumber(size) && size >= 1 && isString(value)) {
    if (value.length <= size) {
      return value;
    }

    suffix = isString(suffix) ? suffix : '...';

    if (suffix.length < size) {
      return value.trim().substr(0, size - suffix.length) + suffix;
    }
  }

  return null;
};

/**
 * @name cssRuleExists
 * @kind function
 *
 * @description
 * Checks if a given CSS Rule Name is defined.
 *
 * @returns {Boolean}
 */
export const cssRuleExists = (className: string): boolean => {
  let exists = false;
  forEach(document.styleSheets, (styleSheet: any) => {
    if (!exists && isDefined(styleSheet.rules)) {
      forEach(styleSheet.rules, (rule: any) => {
        if (isString(rule.selectorText) && rule.selectorText === ('.' + className.trim())) {
          exists = true;
        }
      });
    }
  });
  return exists;
};

/**
 * @name UUID
 * @kind function
 *
 * @description
 * Returns a unique universal identifier.
 *
 * @returns {String} The UUID.
 */
export const UUID = (): string => {
  // Use high-precision timer if available
  if (isDefined(window) && isDefined(window.performance) && isFunction(window.performance.now)) {

    let time = new Date().getTime() + window.performance.now();

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char: string) => {
      const r = (time + Math.random() * 16) % 16 | 0;
      time = Math.floor(time / 16);
      return (char === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });

    // If we have a cryptographically secure PRNG, use that
    // http://stackoverflow.com/questions/6906916/collisions-when-generating-uuids-in-javascript
  } else if (isDefined(window) && typeof isDefined(window.crypto) && isFunction(window.crypto.getRandomValues)) {

    const buf: Uint16Array = new Uint16Array(8);
    window.crypto.getRandomValues(buf);
    return (_pad4(buf[ 0 ]) + _pad4(buf[ 1 ]) + '-' + _pad4(buf[ 2 ]) + '-' + _pad4(buf[ 3 ]) +
    '-' + _pad4(buf[ 4 ]) + '-' + _pad4(buf[ 5 ]) + _pad4(buf[ 6 ]) + _pad4(buf[ 7 ]));

    // Otherwise, just use Math.random
    // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    // https://stackoverflow.com/questions/11605068/why-does-jshint-argue-against-bitwise-operators-how-should-i-express-this-code
  } else {
    return _random4() + _random4() + '-' + _random4() + '-' + _random4() + '-' +
      _random4() + '-' + _random4() + _random4() + _random4();
  }
};

/**
 * @name isNull
 * @kind function
 *
 * @description
 * Determines if a reference is `null`.
 *
 * @param {*} value Reference to check.
 * @returns {Boolean} True if `value` is `null`.
 */
export const isNull = (value: any): boolean => value === null && typeof value === 'object';

/**
 * @name isString
 * @kind function
 *
 * @description
 * Determines if a reference is a `String`.
 *
 * @param {*} value Reference to check.
 * @returns {Boolean} True if `value` is a `String`.
 */
export const isString = (value: any): boolean => typeof value === 'string';

/**
 * @name isUndefined
 * @kind function
 *
 * @description
 * Determines if a reference is undefined.
 *
 * @param {*} value Reference to check.
 * @returns {Boolean} True if `value` is undefined.
 */
export const isUndefined = (value: any): boolean => typeof value === 'undefined';

/**
 * @name isDefined
 * @kind function
 *
 * @description
 * Determines if a reference is defined.
 *
 * @param {*} value Reference to check.
 * @returns {Boolean} True if `value` is defined.
 */
export const isDefined = (value: any): boolean => typeof value !== 'undefined';

/**
 * @name isObject
 * @kind function
 *
 * @description
 * Determines if a reference is an `Object`. Unlike `typeof` in JavaScript, `null`s are not
 * considered to be objects. Note that JavaScript arrays are objects.
 *
 * @param {*} value Reference to check.
 * @returns {Boolean} True if `value` is an `Object` but not `null`.
 */
export const isObject = (value: any): boolean => value !== null && typeof value === 'object';

/**
 * @name isNumber
 * @kind function
 *
 * @description
 * Determines if a reference is a `Number`.
 *
 * This includes the 'special' numbers `NaN`, `+Infinity` and `-Infinity`.
 *
 * If you wish to exclude these then you can use the native
 * [`isFinite'](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isFinite)
 * method.
 *
 * @param {*} value Reference to check.
 * @returns {Boolean} True if `value` is a `Number`.
 */
export const isNumber = (value: any): boolean => typeof value === 'number';

/**
 * @name isDate
 * @kind function
 *
 * @description
 * Determines if a value is a date.
 *
 * @param {*} value Reference to check.
 * @returns {Boolean} True if `value` is a `Date`.
 */
export const isDate = (value: any): boolean => Object.prototype.toString.call(value) === '[object Date]';

/**
 * @name isArray
 * @kind function
 *
 * @description
 * Determines if a reference is an `Array`.
 *
 * @param {*} value Reference to check.
 * @returns {Boolean} True if `value` is an `Array`.
 */
export const isArray = (value: any): boolean => Array.isArray(value);

/**
 * @name isFunction
 * @kind function
 *
 * @description
 * Determines if a reference is a `Function`.
 *
 * @param {*} value Reference to check.
 * @returns {Boolean} True if `value` is a `Function`.
 */
export const isFunction = (value: any): boolean => typeof value === 'function';

/**
 * @name isElement
 * @kind function
 *
 * @description
 * Determines if a reference is a DOM element (or wrapped jQuery element).
 *
 * @param {*} node Reference to check.
 * @returns {Boolean} True if `value` is a DOM element (or wrapped jQuery element).
 */
export const isElement = (node: any): boolean => !!(node && (node.nodeName || (node.prop && node.attr && node.find)));

/**
 * @name isRegExp
 * @kind function
 *
 * @description
 * Determines if a value is a regular expression object.
 *
 * @param {*} value Reference to check.
 * @returns {Boolean} True if `value` is a `RegExp`.
 */
export const isRegExp = (value: any): boolean => toString.call(value) === '[object RegExp]';

/**
 * @name noop
 * @kind function
 *
 * @description
 * A function that performs no operations. This function can be useful when writing code in the
 * functional style.
 */
export const noop = (): void => {};

/**
 * @name getAspectRatioFit
 * @kind function
 *
 * @description
 * Conserve aspect ratio of the orignal region. Useful when shrinking/enlarging
 * images to fit into a certain area.
 *
 * @param {Number} srcWidth Source area width
 * @param {Number} srcHeight Source area height
 * @param {Number} maxWidth Fittable area maximum available width
 * @param {Number} maxHeight Fittable area maximum available height
 * @return {Object} { width, height }
 */
export const getAspectRatioFit = (srcWidth: number, srcHeight: number, maxWidth: number, maxHeight: number):
  { ratio: number, width: number, height: number } => {
  const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  return { ratio: ratio, width: srcWidth * ratio, height: srcHeight * ratio };
};

/**
 * @name extend
 * @kind function
 *
 * @description
 * Extends the destination object `dst` by copying own enumerable properties from the `src` object(s)
 * to `dst`. You can specify multiple `src` objects. If you want to preserve original objects, you can do so
 * by passing an empty object as the target: `let object = extend({}, object1, object2)`.
 *
 * **Note:** Keep in mind that `extend` does not support recursive merge (deep copy). Use
 * {@link merge} for this.
 *
 * @param {Object} dst Destination object.
 * @param {...Object} sources Source object(s).
 * @returns {Object} Reference to `dst`.
 */
export function extend(dst: Object, ...sources: Object[]): Object {
  return _baseExtend(dst, [].slice.call(arguments, 1), false);
}

/**
 * @name merge
 * @kind function
 *
 * @description
 * Deeply extends the destination object `dst` by copying own enumerable properties from the `src` object(s)
 * to `dst`. You can specify multiple `src` objects. If you want to preserve original objects, you can do so
 * by passing an empty object as the target: `let object = merge({}, object1, object2)`.
 *
 * Unlike {@link extend extend()}, `merge()` recursively descends into object properties of source
 * objects, performing a deep copy.
 *
 * @param {Object} dst Destination object.
 * @param {...Object} sources Source object(s).
 * @returns {Object} Reference to `dst`.
 */
export function merge(dst: Object, ...sources: Object[]): Object {
  return _baseExtend(dst, [].slice.call(arguments, 1), true);
}

/**
 * @name forEach
 * @kind function
 *
 * @description
 * Invokes the `iterator` function once for each item in `obj` collection, which can be either an
 * object or an array. The `iterator` function is invoked with `iterator(value, key, obj)`, where `value`
 * is the value of an object property or an array element, `key` is the object property key or
 * array element index and obj is the `obj` itself. Specifying a `context` for the function is optional.
 *
 * It is worth noting that `forEach` does not iterate over inherited properties because it filters
 * using the `hasOwnProperty` method.
 *
 * Unlike ES262's
 * [Array.prototype.forEach](http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.18),
 * providing 'undefined' or 'null' values for `obj` will not throw a TypeError, but rather just
 * return the value provided.
 *
 * @param {Object|Array} obj Object to iterate over.
 * @param {Function} iterator Iterator function.
 * @param {Object=} context Object to become context (`this`) for the iterator function.
 * @returns {Object|Array} Reference to `obj`.
 */
export const forEach = (obj: any, iterator: Function, context?: Object): Object => {

  let key, length;

  if (obj) {

    if (isFunction(obj)) {

      for (key in obj) {
        if (key !== 'prototype' && key !== 'length' && key !== 'name' && obj.hasOwnProperty(key)) {
          iterator.call(context, obj[ key ], key, obj);
        }
      }

    } else if (isArray(obj) || _isArrayLike(obj)) {

      const isPrimitive = typeof obj !== 'object';
      for (key = 0, length = obj.length; key < length; key++) {
        if (isPrimitive || key in obj) {
          iterator.call(context, obj[ key ], key, obj);
        }
      }

    } else if (obj.forEach && obj.forEach !== forEach) {

      obj.forEach(iterator, context, obj);

    } else if (_isBlankObject(obj)) {

      // createMap() fast path --- Safe to avoid hasOwnProperty check because prototype chain is empty
      // tslint:disable
      for (key in obj) {
        iterator.call(context, obj[ key ], key, obj);
      }

    } else if (typeof obj.hasOwnProperty === 'function') {

      // Slow path for objects inheriting Object.prototype, hasOwnProperty check needed
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          iterator.call(context, obj[ key ], key, obj);
        }
      }

    } else {

      // Slow path for objects which do not have a method `hasOwnProperty`
      for (key in obj) {
        if (window.hasOwnProperty.call(obj, key)) {
          iterator.call(context, obj[ key ], key, obj);
        }
      }

    }
  }

  return obj;

};

/**********************************************************************************/
/*                                                                                */
/*                              PRIVATE FUNCTIONS                                 */
/*                                                                                */
/**********************************************************************************/

/**
 * @name _baseExtend
 * @kind function
 *
 * @description
 * Base for `merge` and `extend` functions
 */
const _baseExtend = (dst: Object, objs: any, deep: boolean): Object => {

  for (let i = 0, ii = objs.length; i < ii; ++i) {

    const obj = objs[ i ];

    if (!isObject(obj) && !isFunction(obj)) {
      continue;
    }

    const keys = Object.keys(obj);

    for (let j = 0, jj = keys.length; j < jj; j++) {

      let key = keys[ j ];
      let src = obj[ key ];

      if (deep && isObject(src)) {

        if (isDate(src)) {
          dst[ key ] = new Date(src.valueOf());
        } else if (isRegExp(src)) {
          dst[ key ] = new RegExp(src);
        } else if (src.nodeName) {
          dst[ key ] = src.cloneNode(true);
        } else if (isElement(src)) {
          dst[ key ] = src.clone();
        } else {
          if (!isObject(dst[ key ])) {
            dst[ key ] = isArray(src) ? [] : {};
          }
          _baseExtend(dst[ key ], [ src ], true);
        }

      } else {
        dst[ key ] = src;
      }

    }

  }

  return dst;

};

/**
 * @name _isArrayLike
 * @kind function
 *
 * @description
 * Returns true if `obj` is an array or array-like object (NodeList, Arguments, String ...)
 */
const _isArrayLike = (obj: any): boolean => {

  // `null`, `undefined` and `window` are not array-like
  if (obj == null || _isWindow(obj)) {
    return false;
  }

  // arrays, strings and jQuery/jqLite objects are array like
  // * jqLite is either the jQuery or jqLite constructor function
  // * we have to check the existence of jqLite first as this method is called
  //   via the forEach method when constructing the jqLite object in the first place
  if (isArray(obj) || isString(obj)) {
    return true;
  }

  // Support: iOS 8.2 (not reproducible in simulator)
  // 'length' in obj used to prevent JIT error (gh-11508)
  const length = 'length' in Object(obj) && obj.length;

  // NodeList objects (with `item` method) and
  // other objects with suitable length characteristics are array-like
  return isNumber(length) &&
    (length >= 0 && ((length - 1) in obj || obj instanceof Array) || typeof obj.item === 'function');

};

/**
 * @name _isWindow
 * @kind function
 *
 * @description
 * Checks if `obj` is a window object.
 */
const _isWindow = (obj: any): boolean => obj && obj.window === obj;

/**
 * @name _isBlankObject
 * @kind function
 *
 * @description
 * Determine if a value is an object with a null prototype
 */
const _isBlankObject = (value: any): boolean => value !== null && typeof value === 'object' && !Object.getPrototypeOf(value);

/**
 * @name _pad4
 * @kind function
 *
 * @description
 */
const _pad4 = (num: number): string => {
  let ret = num.toString(16);
  while (ret.length < 4) {
    ret = '0' + ret;
  }
  return ret;
};

/**
 * @name _random4
 * @kind function
 *
 * @description
 */
const _random4 = (): string => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
