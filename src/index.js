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


const immutableMgr = require('./immutableMgr');


module.exports = {

  /**
   * clear
   * @return {{}}
   */
  clear: immutableMgr.clear({}),

  /**
   * @param {object} state
   * @param {string} loc - desired location (1 deep) in object
   */
  get: (state, loc) => immutableMgr.get(state, loc),

  /**
   *
   * @param {object} state
   * @param {string[]} locArray
   * @return {*} desired item from the desired location
   */
  getIn: (state, locArray) => immutableMgr.getIn(state, locArray),

  /**
   * Set
   *
   * @param {object} state - state to update
   * @param {string} loc - desired location (1 deep) in object
   * @param {*} value - the value to set it to
   * @return {object} - new object with the value in place
   */
  set: (state, loc, value) => immutableMgr.set(state, loc, value),

  /**
   * SetIn
   *
   * @param {object} state - state to update
   * @param {string[]} locArray - an array of object properties, updating the last property
   * @param {*} value - the value to set it to
   * @return {object} - new object with the value in place
   */
  setIn: (state, locArray, value) => immutableMgr.setIn(state, locArray, value),
  /**
   * Update part of the state object
   *
   * @param {object} state - state to update
   * @param {string} loc - desired location (1 deep) in object
   * @param {function} func - the value to set it to
   * @return {object} - new object with the value in place
   */
  update: (state, loc, func) => immutableMgr.set(state, loc, func),
  /**
   * update into a nested object
   *
   * @param {object} state - source state
   * @param {string[]} locArray - array leading to desired location
   * @param {function} func - update callback
   */
  updateIn: (state, locArray, func) => immutableMgr.updateIn(state, locArray, func),

  /**
   * delete
   *
   * @param {object} state - source state
   * @param {string} loc - desired location (1 deep) in object
   * @return {object} - new object without the loc
   */
  delete: (state, loc) => immutableMgr.delete(state, loc),

  /**
   * @param {object} state - source state
   * @param {Object|Array} value to be merged
   */
  merge: (state, value) => immutableMgr.merge(state, value),

  // TODO: remove mergeDeep... ALL immutable merges are deep merges. duh
  mergeDeep: (state, value) => immutableMgr.mergeDeep(state, value),

  /**
   * @param {object} state - source state
   * @param {string[]} locArray - array leading to desired location
   * @param {Object|Array} value to be merged
   */
  mergeIn: (state, locArray, value) => immutableMgr.mergeIn(state, locArray, value),

  /**
   * @param {object} state - source state
   * @param {string[]} locArray - array leading to desired location
   * @param {Array} value
   */
  pushIn: (state, locArray, value) => immutableMgr.pushIn(state, locArray, value),

  /**
   * @param {Object} state - source state
   * @param {String} loc - desired location (1 deep) in object
   * @param {Array} value
   */
  push: (state, loc, value) => immutableMgr.push(state, loc, value),


  pullAtIn: (state, locArray, index) => immutableMgr.pullAtIn(state, locArray, index),

  /**
   * Make multiple changes at once. Returns a new object
   *
   * @param {object} state - state to change
   * @param {mutationCallback} func - function full of mutations to make. must return {Mutations}
   * @return {Object} - new object with all the changes made
   */
  withMutations: (state, func) => immutableMgr.withMutations(state, func)
};
