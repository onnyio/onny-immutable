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

module.exports = {

  /**
   * replace the target entirely.
   * @param value
   * @returns {{$set: *}}
   */
  set(value) {
    return { $set: value };
  },
  /**
   * merge the keys of object with the target.
   * @param value
   * @returns {{$merge: *}}
   */
  merge(value) {
    return { $merge: value };
  },
  /**
   * push() all the items in array on the target
   * (adds to end of the array)
   * @param {Array} value
   * @returns {{$push: *}}
   */
  push(value) {
    return { $push: value };
  },
  /**
   * unshift() all the items in array on the target.
   * (adds to front of the array)
   * @param value
   * @returns {{$unshift: *}}
   */
  unshift(value) {
    return { $unshift: value };
  },
  /**
   * passes in the current value to the function
   * and updates it with the new returned value.
   * @param value
   * @returns {{$apply: *}}
   */
  apply(value) {
    return { $apply: value };
  },
  /**
   * passes in the current value to the function
   * and updates it with the new returned value.
   * @param {Array[]} value - array of arrays. [startIndex, numToRemove, ...itemsToAdd]
   * @returns {{$apply: *}}
   */
  splice(value) {
    return { $splice: value };
  }
};
