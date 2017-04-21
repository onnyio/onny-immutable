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


import Mutations, { emptyState } from './mutations';

const immutableMgr = {

  clear: state => emptyState,
  /**
   *
   * @param state
   * @param {string} loc - desired location (1 deep) in object
   */
  get: function get(state, loc) { return state[loc] || null; },

  /**
   *
   * @param state
   * @param locArray
   * @return {*}
   */
  getIn: (state, locArray) => new Mutations(state).getIn(locArray).getState(),

  /**
   * Set
   *
   * @param {object} state - state to update
   * @param {string} loc - desired location (1 deep) in object
   * @param {*} value - the value to set it to
   * @return {object} - new object with the value in place
   */
  set: (state, loc, value) => new Mutations(state).set(loc, value).getState(),


  /**
   * SetIn
   *
   * @param {object} state - state to update
   * @param {string[]} locArray - an array of object properties, updating the last property
   * @param {*} value - the value to set it to
   * @return {object} - new object with the value in place
   */
  setIn: (state, locArray, value) => new Mutations(state).setIn(locArray, value).getState(),

  /**
   * Update part of the state object
   *
   * @param {object} state - state to update
   * @param {string} loc - desired location (1 deep) in object
   * @param {function} func - the value to set it to
   * @return {object} - new object with the value in place
   */
  update: (state, loc, func) => new Mutations(state).update(loc, func).getState(),
  /**
   * update into a nested object
   *
   * @param {object} state - source state
   * @param {string[]} locArray - array leading to desired location
   * @param {function} func - update callback
   */
  updateIn: (state, locArray, func) => new Mutations(state).updateIn(locArray, func).getState(),

  /**
   * delete
   *
   * @param {object} state - source state
   * @param {string} loc - desired location (1 deep) in object
   * @return {object} - new object without the loc
   */
  delete: (state, loc) => new Mutations(state).deleteIn([loc]).getState(),

  /**
   * @param {object} state - source state
   * @param {Object|Array} value to be merged
   */
  merge: (state, value) => new Mutations(state).merge(value).getState(),

  // TODO: remove mergeDeep... ALL immutable merges are deep merges. duh
  mergeDeep: (state, value) => new Mutations(state).mergeDeep(value).getState(),

  /**
   * @param {object} state - source state
   * @param {string[]} locArray - array leading to desired location
   * @param {Object|Array} value to be merged
   */
  mergeIn: (state, locArray, value) => new Mutations(state).mergeIn(locArray, value).getState(),

  /**
   * @param {object} state - source state
   * @param {string[]} locArray - array leading to desired location
   * @param {Array} value
   */
  pushIn: (state, locArray, value) => new Mutations(state).pushIn(locArray, value).getState(),

  /**
   * @param {Object} state - source state
   * @param {String} loc - desired location (1 deep) in object
   * @param {Array} value
   */
  push: (state, loc, value) => new Mutations(state).push(loc, value).getState(),

  // filter: (state, loc, predicate) => new Mutations(state).filter(loc, predicate).getState(),

  pullAtIn: (state, locArray, index) => new Mutations(state).pullAtIn(locArray, index).getState(),

  /**
   * callback for the withMutations callback
   * @callback mutationCallback
   * @param {Mutations} mutationState - Mutations with source state
   * @return Mutations
   */

  /**
   * Make multiple changes at once. Returns a new object
   *
   * @param {object} state - state to change
   * @param {mutationCallback} func - function full of mutations to make. must return {Mutations}
   * @return {Object} - new object with all the changes made
   */
  withMutations: (state, func) => func(new Mutations(state)).getState()

};

export default immutableMgr;
