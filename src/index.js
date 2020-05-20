/**
 * @Copyright (C) 2015-2020 Onny LLC - All Rights Reserved
 *
 * This file is part of onny-immutable and is the sole property of its owner.
 * Unauthorized use of this file, via any medium or form, whole or in part,
 * is strictly prohibited without the expressed written permission of Onny LLC and/or Isaac Marotte
 *
 * This file is proprietary and confidential
 *
 * Last Modified: 2020.5.19
 */

/* eslint-disable import/prefer-default-export */

import Mutations, { EMPTY_STATE } from './mutations';

/**
 * callback for the withMutations callback
 * @typedef {callback} funcWithMutations
 * @param {Mutations} mutationState - Mutations with source state
 * @returns {Mutations}
 */


export const immutableMgr = {

  /**
   * clear
   * @return {{}}
   */
  clear: () => EMPTY_STATE,

  /**
   * @param {Object} srcState
   * @param {string} loc - desired location (1 deep) in object
   * @returns {*|null} - desired item from the desired location. null if not found
   */
  get: (srcState, loc) => srcState[loc] || null,

  /**
   * @param {Object} srcState - The state to check
   * @param {string[]} locArray - array to the desired location inside object
   * @returns {*|null} - desired item from the desired location. null if not found
   */
  getIn(srcState, locArray) {
    return new Mutations(srcState).getIn(locArray)
      .getState();
  },

  /**
   * Set
   *
   * @param {Object} srcState - state to update
   * @param {*} value - the value to set it to
   * @return {Object} - new object with the value in place
   */
  set: (srcState, value) => new Mutations(srcState).set(value)
    .getState(),
  /**
   * @param {Object} srcState - state to update
   * @param {string[]} locArray - an array of object properties, updating the last property
   * @param {*} value - the value to set it to
   * @return {Object} - new object with the value in place
   */
  setIn: (srcState, locArray, value) => new Mutations(srcState)
    .setIn(locArray, value)
    .getState(),

  /**
   * Update part of the state object
   *
   * @param {Object} srcState - state to update
   * @param {string} loc - desired location (1 deep) in object
   * @param {callback} fn - the value to set it to
   * @return {Object} - new object with the value in place
   */
  update: (srcState, loc, fn) => new Mutations(srcState)
    .update(loc, fn)
    .getState(),

  /**
   * update into a nested object
   *
   * @param {Object} srcState - source state
   * @param {string[]} locArray - array leading to desired location
   * @param {callback} fn - update callback
   * @return {Object} updated state
   */
  updateIn: (srcState, locArray, fn) => new Mutations(srcState)
    .updateIn(locArray, fn)
    .getState(),

  /**
   * delete
   *
   * @param {Object} srcState - source state
   * @param {string} loc - desired location (1 deep) in object
   * @return {Object} - new object without the loc
   */
  remove: (srcState, loc) => new Mutations(srcState)
    .deleteIn([loc])
    .getState(),

  /**
   * delete
   *
   * @param {Object} srcState - source state
   * @param {string[]} locArray - array leading to desired location
   * @return {Object} - new object without the loc
   */
  removeIn: (srcState, locArray) => new Mutations(srcState)
    .deleteIn(locArray)
    .getState(),

  /**
   * @param {Object} srcState - source state
   * @param {Object|Array} value to be merged
   * @return {Object} updated state
   */
  merge: (srcState, value) => new Mutations(srcState)
    .merge(value)
    .getState(),

  /**
   * @param {Object} srcState - source state
   * @param {string[]} locArray - array leading to desired location
   * @param {Object|Array} value to be merged
   * @return {Object} updated state
   */
  mergeIn: (srcState, locArray, value) => new Mutations(srcState)
    .mergeIn(locArray, value)
    .getState(),

  /**
   * @param {Object} srcState - source state
   * @param {string[]} locArray - array leading to desired location
   * @param {*[]} values
   * @return {Object} updated state
   */
  pushIn: (srcState, locArray, values) => new Mutations(srcState)
    .pushIn(locArray, values)
    .getState(),

  /**
   * @param {Object} srcState - source state
   * @param {string} loc - desired location (1 deep) in object
   * @param {Array} value
   */
  push: (srcState, loc, value) => new Mutations(srcState)
    .push(loc, value)
    .getState(),

  /**
   * Adds new items to the beginning of an existing array
   *
   * @param {Object} srcState - source state
   * @param {string} loc - desired location (1 deep) in object
   * @param {*[]} value
   * @return {Object} updated state
   */
  unshift: (srcState, loc, value) => new Mutations(srcState).unshift(loc, value)
    .getState(),

  /**
   * Adds new items to the beginning of an existing array at a desired location
   *
   * @param {Object} srcState - source state
   * @param {string[]} locArray - array leading to desired location
   * @param {*[]} value
   * @return {Object} updated state
   */
  unshiftIn: (srcState, locArray, value) => new Mutations(srcState).unshiftIn(locArray, value)
    .getState(),

  /**
   *
   * @param {Object} srcState - source state
   * @param {string[]} locArray - array leading to desired location
   * @param {number|number[]} indices  - indexes to remove
   * @return {Object} updated state
   */
  pullAtIn: (srcState, locArray, indices) => new Mutations(srcState)
    .pullAtIn(locArray, indices)
    .getState(),

  /**
   * Make multiple changes at once. Returns a new object
   *
   * @param {Object} srcState - source state
   * @param {funcWithMutations} fn - function full of mutations to make. must return {Mutations}
   * @return {Object} - new object with all the changes made
   */
  withMutations(srcState, fn) {
    /** @type Mutations */
    const mutations = new Mutations(srcState);
    return fn(mutations).getState();
  }
};

// export default immutableMgr
