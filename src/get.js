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

/**
 * get from state
 * @param {object} state
 * @param {string} loc - desired location (1 deep) in object
 * @return {*|null} - null if not found, otherwise item
 */
module.exports = function get(state, loc) {
  return state[loc] || null;
};
