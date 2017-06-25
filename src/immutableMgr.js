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


export const clear = state => emptyState;
/**
 *
 * @param state
 * @param {string} loc - desired location (1 deep) in object
 */
export function get(state, loc) { return state[loc] || null; }

/**
 *
 * @param state
 * @param locArray
 * @return {*}
 */
export const getIn = (state, locArray) => new Mutations(state).getIn(locArray).getState();

/**
 * Set
 *
 * @param {object} state - state to update
 * @param {string} loc - desired location (1 deep) in object
 * @param {*} value - the value to set it to
 * @return {object} - new object with the value in place
 */
export const set = (state, loc, value) => new Mutations(state).set(loc, value).getState();


/**
 * SetIn
 *
 * @param {object} state - state to update
 * @param {string[]} locArray - an array of object properties, updating the last property
 * @param {*} value - the value to set it to
 * @return {object} - new object with the value in place
 */
export const setIn = (state, locArray, value) => new Mutations(state).setIn(locArray, value)
  .getState();

/**
 * Update part of the state object
 *
 * @param {object} state - state to update
 * @param {string} loc - desired location (1 deep) in object
 * @param {function} func - the value to set it to
 * @return {object} - new object with the value in place
 */
export const update = (state, loc, func) => new Mutations(state).update(loc, func).getState();
/**
 * update into a nested object
 *
 * @param {object} state - source state
 * @param {string[]} locArray - array leading to desired location
 * @param {function} func - update callback
 */
export const updateIn = (state, locArray, func) => new Mutations(state).updateIn(locArray, func)
  .getState();

/**
 * remove
 *
 * @param {object} state - source state
 * @param {string} loc - desired location (1 deep) in object
 * @return {object} - new object without the loc
 */
export const remove = (state, loc) => new Mutations(state).deleteIn([loc]).getState();

/**
 * removeIn
 *
 * @param {object} state - source state
 * @param {string[]} locArray - array leading to desired location
 * @return {object} - new object without the loc
 */
export const removeIn = (state, locArray) => new Mutations(state).deleteIn(locArray).getState();

/**
 * @param {object} state - source state
 * @param {Object|Array} value to be merged
 */
export const merge = (state, value) => new Mutations(state).merge(value).getState();

// TODO: remove mergeDeep... ALL immutable merges are deep merges. duh
export const mergeDeep = (state, value) => new Mutations(state).mergeDeep(value).getState();

/**
 * @param {object} state - source state
 * @param {string[]} locArray - array leading to desired location
 * @param {Object|Array} value to be merged
 */
export const mergeIn = (state, locArray, value) => new Mutations(state).mergeIn(locArray, value)
  .getState();

/**
 * @param {object} state - source state
 * @param {string[]} locArray - array leading to desired location
 * @param {Array} value
 */
export const pushIn = (state, locArray, value) => new Mutations(state).pushIn(locArray, value)
  .getState();

/**
 * @param {Object} state - source state
 * @param {String} loc - desired location (1 deep) in object
 * @param {Array} value
 */
export const push = (state, loc, value) => new Mutations(state).push(loc, value).getState();

/**
 * Adds new items to the beginning of an existing array
 *
 * @param {Object} state - source state
 * @param {String} loc - desired location (1 deep) in object
 * @param {Array} value
 */
export const unshift = (state, loc, value) => new Mutations(state).unshift(loc, value).getState();

/**
 * Adds new items to the beginning of an existing array at a desired location
 *
 * @param {object} state - source state
 * @param {string[]} locArray - array leading to desired location
 * @param {Array} value
 */
export const unshiftIn = (state, locArray, value) => new Mutations(state).unshiftIn(locArray, value)
  .getState();

// filter: (state, loc, predicate) => new Mutations(state).filter(loc, predicate).getState(),

export const pullAtIn = (state, locArray, index) => new Mutations(state).pullAtIn(locArray, index)
  .getState();

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
export const withMutations = (state, func) => func(new Mutations(state)).getState();
