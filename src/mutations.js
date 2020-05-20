/**
 * @Copyright (C) 2015-2018 Onny LLC - All Rights Reserved
 *
 * This file is part of onny-immutable and is the sole property of its owner.
 * Unauthorized use of this file, via any medium or form, whole or in part,
 * is strictly prohibited without the expressed written permission of Onny LLC and/or Isaac Marotte
 *
 * This file is proprietary and confidential
 *
 * Last Modified: 2018.3.10
 */


import reactUpdate from 'immutability-helper';
import merge from '@onny/utils/merge';
import cloneDeep from '@onny/utils/cloneDeep';
import clone from '@onny/utils/clone';
import pullAt from '@onny/utils/pullAt';
import forEach from '@onny/utils/forEach';
import isEmpty from '@onny/utils/isEmpty';
import isEqual from '@onny/utils/isEqual';
import immutableCommands from './immutableCommands';


const update = (state, command) => (reactUpdate(state, command));

/**
 *
 * @type {{}}
 */
export const EMPTY_STATE = {};



/**
 * validators
 * @type {Object<function(*): boolean>}
 */
const isType = {
  null: (value) => (typeof (value) === 'undefined' || value === null),
  array: (value) => (Array.isArray(value))
};

/**
 *
 * @param {string[]} locArray
 * @param {function} command
 * @return {Object}
 */
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


/**
 *
 * @param {Object} state
 * @param {string[]} locArray
 * @return {null|*}
 */
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
 * @param {Object} state
 * @param {String[]} locArray
 * @param {boolean} makeLastItemArray
 * @return {*} ensures there is something at every step of locArray, placing {} if not
 */
const addObjPlaceholder = (state = {}, locArray, makeLastItemArray = false) => {
  let objPointer = state;
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

/**
 *
 * @param {Object} state
 * @param {string[]} locArray
 * @return {boolean}
 */
const doesLocExist = (state, locArray) => getInCopy(state, locArray) !== null; // turn into boolean


/////////////////////////////
// immutableMgr
/////////////////////////////

/**
 * @class Mutations
 * @property {object} state
 * @property {object} originalState
 */
class Mutations {
  /**
   * @memberOf Mutations#
   * @this Mutations
   * @param {Object} srcState
   */
  constructor(srcState) {
    // make a copy so we don't mess up the original
    /** @type Object*/
    this.state = srcState;
    /** @type Object*/
    this.originalState = cloneDeep(this.state);
  }

  /**
   * return the state object
   * @function getState
   * @memberOf Mutations#
   * @return {Object} - the newly created object
   */
  getState() {
    // if the state hasn't change, return the original state to preserve shallow compares
    if (isEqual(this.state, this.originalState)) {
      return this.state;
    }
    // if we don't exist, make sure to return undefined to make use of defaultProps
    // TODO: is the the behavior we actually want? I kind of think we should return the value whatever it is
    return this.state !== null ? this.state : undefined;
  }

  /**
   *
   * @function getIn
   * @memberOf Mutations#
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

  /**
   * @function clear
   * @memberOf Mutations#
   * @return {Mutations}
   */
  clear() {
    this.state = EMPTY_STATE;
    return this;
  }


  /**
   * @function set
   * @memberOf Mutations#
   * @param {*} value
   * @return {Mutations}
   */
  set(value) {
    if (isEqual(this.state, value)) {
      return this;
    }
    this.state = update(this.state, immutableCommands.set(value));
    return this;
  }

  /**
   *
   * @function setIn
   * @memberOf Mutations#
   * @this Mutations
   * @param {string[]} locArray - array leading to desired location
   * @param {*} value - value to set
   * @return {Mutations}
   */
  setIn(locArray, value) {
    if (!locArray || isEmpty(locArray)) { return this; }
    const placeholder = addObjPlaceholder(this.state, locArray);
    this.state = update(placeholder, useCommandIn(locArray, immutableCommands.set(value)));

    return this;
  }
  /**
   * @memberOf Mutations#
   * @this Mutations
   * @param {string[]} locArray - array leading to desired location
   * @param {*} value - value to set
   * @return {Mutations}
   */
  setInBleh(locArray, value) {
    if (!locArray || isEmpty(locArray)) { return this; }
    const placeholder = addObjPlaceholder(this.state, locArray);
    this.state = update(placeholder, useCommandIn(locArray, immutableCommands.set(value)));

    return this;
  }

  /**
   * @function update
   * @memberOf Mutations#
   * @param {string} loc
   * @param {callback} func
   * @return {Mutations}
   */
  update(loc, func) {
    if (isEmpty(this.state) || this.state === null) {
      return this;
    }
    this.state = update(this.state, {
      [loc]: immutableCommands.apply(func)
    });
    return this;
  }

  /**
   *
   * @function updateIn
   * @memberOf Mutations#
   * @param {string[]} locArray - array leading to desired location
   * @param {callback} func
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
   * @function merge
   * @memberOf Mutations#
   * @param {Object|Array} value to be merged
   * @return {Mutations}
   */
  merge(value) {
    this.state = update(this.state, immutableCommands.set(merge(clone(this.state), value)));
    return this;
  }

  /**
   * Merge value into state at desired location
   *
   * @function mergeIn
   * @memberOf Mutations#
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
   * push onto the end of an existing array
   *
   * @function push
   * @memberOf Mutations#
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
   * @function pushIn
   * @memberOf Mutations#
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
   * @function unshift
   * @memberOf Mutations#
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
   * @function unshiftIn
   * @memberOf Mutations#
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
   * @function pullAtIn
   * @memberOf Mutations#
   * @param {string[]} locArray - array leading to desired location
   * @param {number|number[]} indices  - indexes to remove
   * @return {Mutations}
   */
  pullAtIn(locArray, indices) {
    const placeholder = getInCopy(this.state, locArray);
    if (!isType.array(placeholder)) {
      return this;
    }
    // make sure the index is valid
    if (placeholder.length <= indices) {
      return this;
    }
    pullAt(placeholder, indices);
    this.setIn(locArray, placeholder);
    return this;
  }


  /**
   * delete an item nested in an object
   *
   * @function deleteIn
   * @memberOf Mutations#
   * @this Mutations
   * @param {string[]} locArray - array leading to desired location
   * @return {Mutations}
   */
  deleteIn(locArray) {
    if (
      isEmpty(this.state)
      || !Array.isArray(locArray)
      || locArray.length === 0
      || !doesLocExist(this.state, locArray)
    ) { return this; }

    if (locArray.length === 1) {
      this.state = update(this.state, immutableCommands.unset(locArray));
      return this;
    }
    const toDelete = [locArray[locArray.length - 1]];
    const location = locArray.slice(0, locArray.length - 1);
    const deleted = useCommandIn(location, immutableCommands.unset(toDelete));
    this.state = update(this.state, deleted);
    return this;
  }
}

export default Mutations;
