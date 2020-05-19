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


import {
  clear,
  get,
  getIn,
  set,
  setIn,
  update,
  updateIn,
  remove,
  removeIn,
  merge,
  mergeIn,
  push,
  pushIn,
  unshift,
  unshiftIn,
  pullAtIn,
  withMutations
} from './immutableMgr';


module.exports = {

  /**
   * clear
   * @return {{}}
   */
  clear: () => clear({}),

  /**
   * @param {object} state
   * @param {string} loc - desired location (1 deep) in object
   * @returns {*|null} - desired item from the desired location. null if not found
   */
  get: (state, loc) => get(state, loc),

  /**
   * @param {object} state - The state to check
   * @param {string[]} locArray - array to the desired location inside object
   * @returns {*|null} - desired item from the desired location. null if not found
   */
  getIn: (state, locArray) => getIn(state, locArray),

  /**
   * Set
   *
   * @param {object} state - state to update
   * @param {*} value - the value to set it to
   * @return {object} - new object with the value in place
   */
  set: (state, value) => set(state, value),

  /**
   * SetIn
   *
   * @param {object} state - state to update
   * @param {string[]} locArray - an array of object properties, updating the last property
   * @param {*} value - the value to set it to
   * @return {object} - new object with the value in place
   */
  setIn: (state, locArray, value) => setIn(state, locArray, value),
  /**
   * Update part of the state object
   *
   * @param {object} state - state to update
   * @param {string} loc - desired location (1 deep) in object
   * @param {function} predicate - the value to set it to
   * @return {object} - new object with the value in place
   */
  update: (state, loc, predicate) => update(state, loc, predicate),
  /**
   * update into a nested object
   *
   * @param {object} state - source state
   * @param {string[]} locArray - array leading to desired location
   * @param {function} predicate - update callback
   */
  updateIn: (state, locArray, predicate) => updateIn(state, locArray, predicate),

  /**
   * delete
   *
   * @param {object} state - source state
   * @param {string} loc - desired location (1 deep) in object
   * @return {object} - new object without the loc
   */
  remove: (state, loc) => remove(state, loc),

  /**
   * delete
   *
   * @param {object} state - source state
   * @param {string[]} locArray - array leading to desired location
   * @return {object} - new object without the loc
   */
  removeIn: (state, locArray) => removeIn(state, locArray),

  /**
   * @param {object} state - source state
   * @param {Object|Array} value to be merged
   */
  merge: (state, value) => merge(state, value),

  /**
   * @param {object} state - source state
   * @param {string[]} locArray - array leading to desired location
   * @param {Object|Array} value to be merged
   */
  mergeIn: (state, locArray, value) => mergeIn(state, locArray, value),

  /**
   * @param {object} state - source state
   * @param {string[]} locArray - array leading to desired location
   * @param {*[]} valueArray
   */
  pushIn: (state, locArray, valueArray) => pushIn(state, locArray, valueArray),

  /**
   * @param {Object} state - source state
   * @param {String} loc - desired location (1 deep) in object
   * @param {Array} value
   */
  push: (state, loc, value) => push(state, loc, value),

  /**
   * Adds new items to the beginning of an existing array
   *
   * @param {Object} state - source state
   * @param {String} loc - desired location (1 deep) in object
   * @param {Array} value
   */
  unshift: (state, loc, value) => unshift(state, loc, value),

  /**
   * Adds new items to the beginning of an existing array at a desired location
   *
   * @param {object} state - source state
   * @param {string[]} locArray - array leading to desired location
   * @param {Array} value
   */
  unshiftIn: (state, locArray, value) => unshiftIn(state, locArray, value),


  /**
   *
   * @param {object} state - source state
   * @param {string[]} locArray - array leading to desired location
   * @param {number|number[]} indexes - indexes to remove
   * @return {Object} updated state
   */
  pullAtIn: (state, locArray, indexes) => pullAtIn(state, locArray, indexes),

  /**
   * Make multiple changes at once. Returns a new object
   *
   * @param {object} state - state to change
   * @param {mutationsPredicate} predicate - function full of mutations to make. must return {Mutations}
   * @return {Object} - new object with all the changes made
   */
  withMutations: (state, predicate) => withMutations(state, predicate)
};
