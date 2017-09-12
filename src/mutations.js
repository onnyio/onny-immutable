/**
 * @Copyright (C) 2015-2017 Onny LLC - All Rights Reserved
 *
 * This file is part of onny-immutable and is the sole property of its owner.
 * Unauthorized use of this file, via any medium or form, whole or in part,
 * is strictly prohibited without the expressed written permission of Onny LLC and/or Isaac Marotte
 *
 * This file is proprietary and confidential
 *
 * Last Modified: 2017.4.20
 */


import reactUpdate from 'immutability-helper';
import {
  merge,
  omit,
  cloneDeep,
  clone,
  pullAt,
  forEach,
  isEmpty,
  isEqual
} from 'onny-utils';
import { isNull } from 'onny-validate';
import immutableCommands from './immutableCommands';


const update = (state, command) => (reactUpdate(state, command));

export const emptyState = {};

const isType = {
  null: value => (typeof (value) === 'undefined' || value === null),
  // string: value => (typeof (value) === 'string'),
  array: value => (Array.isArray(value))
  // boolean: (value) => {
  //  if (typeof (value) === 'boolean') { return true; }
  //  if (value === 1 || value === 0) { return true; }
  //  if (isType.string(value)) {
  //    return validator.isBoolean(value);
  //  }
  //  return false;
  // }
};

const useCommandIn = (locArray, command) => {
  let objPointer = {};
  const fullObj = objPointer;

  for (let i = 0; i < locArray.length; i += 1) {
    // make an object unless we're the last one
    if (i === (locArray.length - 1)) {
      objPointer[locArray[i]] = command;
    } else {
      objPointer[locArray[i]] = {};
    }
    objPointer = objPointer[locArray[i]];
  }

  return fullObj;
};


const getInCopy = (state, locArray) => {
  let result = cloneDeep(state);
  forEach(locArray, (loc) => {
    result = result[loc];
    return !isType.null(result);
  });

  // if we're not found, return false
  if (isType.null(result)) {
    return null;
  }
  return result;
};

/**
 * Add placeholders at every step in locArray
 * some functions require empty objects to be stubbed in if they don't exist
 *
 * @example merge({}, {topic: 'bar'}) //will fail because topic does not exist in the first param
 *
 * @param {object} state
 * @param {String[]} locArray
 * @param {boolean} makeLastItemArray
 * @return {*} ensures there is something at every step of locArray, placing {} if not
 */
const addObjPlaceholder = (state, locArray, makeLastItemArray = false) => {
  // make sure we're working on a copy, so we dont lose our place
  let objPointer = cloneDeep(state);
  // assign us to the newly created pointer
  const fullObj = objPointer;

  for (let i = 0; i < locArray.length; i += 1) {
    if (!objPointer[locArray[i]]) {
      objPointer[locArray[i]] = {};
    }

    // if we are trying to use an array instead of an object,
    // make the last element an array
    if (makeLastItemArray // ensure we want an array
      && ((i + 1) >= locArray.length) // ensure last item
      && isEmpty(objPointer[locArray[i]]) // ensure we are empty
      && !isType.array(objPointer[locArray[i]])) { // ensure we're not already an array
      objPointer[locArray[i]] = [];
    }

    objPointer = objPointer[locArray[i]];
  }
  return fullObj;
};

const doesLocExist = (state, locArray) => getInCopy(state, locArray) !== null // turn into boolean
;


/////////////////////////////
// immutableMgr
/////////////////////////////

/**
 * @class Mutations
 */
export default class Mutations {
  constructor(state = {}) {
    // make a copy so we don't mess up the original
    this.originalState = state;
    this.state = cloneDeep(this.originalState);
  }

  /**
   * return the state object
   *
   * @return {Object} - the newly created object
   */
  getState() {
    // if the state hasn't change, return the original state to preserve shallow compares
    if (isEqual(this.state, this.originalState)) {
      return this.originalState;
    }
    // if we don't exist, make sure to return undefined to make use of defaultProps
    return this.state || undefined;
  }

  /**
   *
   * @param {string[]} locArray - array leading to desired location
   * @return {Mutations}
   */
  getIn(locArray) {
    let result = this.state;
    forEach(locArray, (loc) => {
      result = result[loc];
      return !isType.null(result);
    });

    // if we're not found, return false
    if (isType.null(result)) {
      this.state = null;
    } else {
      this.state = result;
    }
    return this;
  }

  clear() {
    this.state = emptyState;
    return this;
  }

  /**
   *
   * @param {string[]} locArray - array leading to desired location
   * @param value
   * @return {Mutations}
   */
  setIn(locArray, value) {
    this.state = update(this.state, useCommandIn(locArray, immutableCommands.set(value)));
    return this;
  }

  set(loc, value) {
    if (!loc) { return this; }
    this.state = update(this.state, {
      [loc]: immutableCommands.set(value)
    });
    return this;
  }

  update(loc, func) {
    if (isEmpty(this.state) || isNull(this.state)) {
      return this;
    }
    this.state = update(this.state, {
      [loc]: immutableCommands.apply(func)
    });
    return this;
  }

  /**
   *
   * @param {string[]} locArray - array leading to desired location
   * @param func
   * @return {Mutations}
   */
  updateIn(locArray, func) {
    if (!doesLocExist(this.state, locArray)) {
      return this;
    }
    this.state = update(this.state, useCommandIn(locArray, immutableCommands.apply(func)));
    return this;
  }

  /**
   * Merge value into state
   *
   * @param {Object|array} value to be merged
   * @return {Mutations}
   */
  merge(value) {
    this.state = update(this.state, immutableCommands.set(merge(clone(this.state), value)));
    return this;
  }

  /**
   * Merge value into state at desired location
   *
   * @param {string[]} locArray - array leading to desired location
   * @param {Object|array} value to be merged
   * @return {Mutations}
   */
  mergeIn(locArray, value) {
    const placeholder = addObjPlaceholder(this.state, locArray);
    const merged = useCommandIn(locArray, immutableCommands.merge(value));
    this.state = update(placeholder, merged);
    return this;
  }

  /**
   * mergeDeep
   * @param {Object|array} value to be merged
   * @return {Mutations}
   */
  mergeDeep(value) {
    const deepCopy = cloneDeep(this.state);
    const merged = merge(deepCopy, value);

    this.state = update(this.state, immutableCommands.set(merged));
    return this;
  }


  /**
   * push onto the end of an existing array
   *
   * @param {String} loc - desired location
   * @param {Array} value - array of values to push
   * @return {Mutations}
   */
  push(loc, value) {
    return this.pushIn([loc], value);
  }

  /**
   * push onto the end of an existing array at a desired location
   *
   * @param {string[]} locArray - array leading to desired location
   * @param {Array} value - array of values to push
   * @return {Mutations}
   */
  pushIn(locArray, value) {
    const placeholder = addObjPlaceholder(this.state, locArray, true);

    // make sure we exist and we're an array, otherwise bail
    if (!isType.array(getInCopy(placeholder, locArray))) {
      return this;
    }
    const pushed = useCommandIn(locArray, immutableCommands.push(value));
    this.state = update(placeholder, pushed);
    return this;
  }


  /**
   * Adds new items to the beginning of an existing array
   *
   * @param {String} loc - desired location
   * @param {Array} value - array of values to add to beginning
   * @return {Mutations}
   */
  unshift(loc, value) {
    return this.unshiftIn([loc], value);
  }

  /**
   * Adds new items to the beginning of an existing array at a desired location
   *
   * @param {string[]} locArray - array leading to desired location
   * @param {Array} value - array of values to add to beginning
   * @return {Mutations}
   */
  unshiftIn(locArray, value) {
    const placeholder = addObjPlaceholder(this.state, locArray, true);

    // make sure we exist and we're an array, otherwise bail
    if (!isType.array(getInCopy(placeholder, locArray))) {
      return this;
    }
    const pushed = useCommandIn(locArray, immutableCommands.unshift(value));
    this.state = update(placeholder, pushed);
    return this;
  }

  /**
   * Remove indexes from an array at a desired location
   *
   * @param {string[]} locArray - array leading to desired location
   * @param {number|number[]} indexes - indexes to remove
   * @return {Mutations}
   */
  pullAtIn(locArray, indexes) {
    const placeholder = getInCopy(this.state, locArray);
    if (!isType.array(placeholder)) {
      return this;
    }
    pullAt(placeholder, indexes);
    return this.setIn(locArray, placeholder);
  }


  /**
   * delete an item nested in an object
   *
   * @param {string[]} locArray - array leading to desired location
   * @return {Mutations}
   */
  deleteIn(locArray) {
    // early out if we only have 1
    if (locArray.length === 1) {
      this.state = omit(this.state, locArray[0]);
      return this;
    }
    // make sure we're working on a copy, so we dont lose our place
    let objPointer = cloneDeep(this.state);
    // assign us to the newly created pointer
    this.state = objPointer;

    for (let i = 0; i < locArray.length; i += 1) {
      // if the next step in array doesn't exist, bail now
      if (isNull(objPointer[locArray[i]])) {
        return this;
      }

      if (i <= (locArray.length - 2)) {
        objPointer[locArray[i]] = omit(objPointer[locArray[i]], locArray[i + 1]);
        return this;
      }
      objPointer = objPointer[locArray[i]];
    }
    return this;
  }
}
