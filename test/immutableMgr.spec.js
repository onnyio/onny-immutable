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


import chai, { expect } from 'chai';
import immutableMgr from '../src/index';
import { emptyState } from '../src/mutations';
import { isEqual, cloneDeep } from 'onny-utils';


const nestedProp1 = 'nestedProp1';
const defaultProp1 = 'defaultProp1';
const defaultProp2 = 'defaultProp2';
const defaultProp3 = 'defaultProp3';
const defaultArrayItem = 'defaultArrayItem';
const defaultArray = [defaultArrayItem];
const addProp4 = 'addProp4';

let result;
let origState;
let state;
let loc;

describe('immutableMgr', () => {
  beforeEach(() => {
    result = null;
    origState = {
      defaultProp1: { nestedProp1 },
      defaultProp2,
      defaultProp3
    };
    state = cloneDeep(origState);
    loc = null;
  });

  describe('clear', () => {
    it('clear', () => {
      result = immutableMgr.clear();
      expect(result).to.deep.equal({});
    });
  });

  // get
  /////////////////

  describe('get', () => {
    it('empty state', () => {
      result = immutableMgr.get({}, loc);
      expect(result).to.deep.equal(null);
    });

    it('invalid location', () => {
      result = immutableMgr.get(state, loc);
      expect(result).to.deep.equal(null);
    });

    it('incorrect location', () => {
      result = immutableMgr.get(state, 'wrongLocation');
      expect(result).to.deep.equal(null);
    });

    it('Returns correct prop', () => {
      result = immutableMgr.get(state, defaultProp3);
      expect(result).to.equal(defaultProp3);
    });
  }); // get

  // getIn
  /////////////////

  describe('getIn', () => {
    beforeEach(() => {
      loc = ['defaultProp1', 'nestedProp1'];
    });

    it('empty state', () => {
      result = immutableMgr.getIn({}, [loc]);
      expect(result).to.deep.equal(null);
    });

    it('invalid location', () => {
      result = immutableMgr.getIn(state, [null]);
      expect(result).to.deep.equal(null);
    });

    it('has non-array location', () => {
      result = immutableMgr.getIn(state, defaultProp3);
      expect(result).to.deep.equal(null);
    });

    it('incorrect location', () => {
      result = immutableMgr.getIn(state, [defaultProp1, defaultProp2]);
      expect(result).to.deep.equal(null);
    });

    it('Returns correct prop', () => {
      result = immutableMgr.getIn(state, loc);
      expect(result).to.equal(nestedProp1);
    });
  }); // getIn

  // set
  /////////////////

  describe('set', () => {
    it('Has empty source state', () => {
      result = immutableMgr.set({}, defaultProp1, defaultProp1);
      expect(result).to.deep.equal({
        defaultProp1
      });
    });


    it('invalid location returns null', () => {
      result = immutableMgr.set(state, null, defaultProp1);
      expect(result).to.deep.equal(state);
    });

    it('Does not mutate original state', () => {
      result = immutableMgr.set(state, addProp4, addProp4);
      expect(state).to.deep.equal(origState);
    });

    it('Creates and sets new location', () => {
      result = immutableMgr.set(state, addProp4, addProp4);
      expect(result).to.deep.equal({
        defaultProp1: {
          nestedProp1
        },
        defaultProp2,
        defaultProp3,
        addProp4
      });
    });

    it('Replaces existing location', () => {
      result = immutableMgr.set(state, 'defaultProp1', addProp4);
      expect(result).to.deep.equal({
        defaultProp1: addProp4,
        defaultProp2,
        defaultProp3
      });
    });
  }); // set

  // Update
  /////////////////

  describe('update', () => {
    let updateFunc;
    beforeEach(() => {
      updateFunc = (x) => {
        if (isEqual(x, origState.defaultProp1)) {
          return addProp4;
        }
        return x;
      };
    });
    it('Has empty source state', () => {
      result = immutableMgr.update({}, 'defaultProp1', updateFunc);
      expect(result).to.deep.equal({});
    });

    it('Does not mutate original state', () => {
      result = immutableMgr.update(state, 'defaultProp1', updateFunc);
      expect(state).to.deep.equal(origState);
    });

    it('func locates and updates defaultProp1', () => {
      result = immutableMgr.update(state, 'defaultProp1', updateFunc);
      expect(result).to.deep.equal({
        defaultProp1: addProp4,
        defaultProp2,
        defaultProp3
      });
    });
  }); // update

  // UpdateIn
  /////////////////

  describe('updateIn', () => {
    let updateFunc;
    beforeEach(() => {
      updateFunc = (x) => {
        if (isEqual(x, origState.defaultProp1.nestedProp1)) {
          return addProp4;
        }
        return x;
      };
    });
    it('Has empty source state', () => {
      result = immutableMgr.updateIn(emptyState, [defaultProp1, nestedProp1], updateFunc);
      expect(result).to.deep.equal(emptyState);
    });

    it('Does not mutate original state', () => {
      result = immutableMgr.updateIn(state, [defaultProp1, nestedProp1], updateFunc);
      expect(state).to.deep.equal(origState);
    });

    it('func locates and updates nestedProp1', () => {
      result = immutableMgr.updateIn(state, [defaultProp1, nestedProp1], updateFunc);
      expect(result).to.deep.equal({
        defaultProp1: { nestedProp1: addProp4 },
        defaultProp2,
        defaultProp3
      });
    });

    it('Does not create non-existent location', () => {
      result = immutableMgr.updateIn(state, [defaultProp1, addProp4], updateFunc);
      expect(result).to.equal(state);
    });
  }); // updateIn

  // Merge
  /////////////////

  describe('merge', () => {
    it('Merges with empty source state', () => {
      result = immutableMgr.merge({}, origState.defaultProp1);
      expect(result).to.deep.equal({ nestedProp1 });
    });

    it('Does not mutate original state', () => {
      result = immutableMgr.merge(state, { addProp4 });
      expect(state).to.deep.equal(origState);
      expect(result).to.deep.equal({
        defaultProp1: { nestedProp1 },
        defaultProp2,
        defaultProp3,
        addProp4
      });
    });
  }); // merge


  // mergeIn
  /////////////////

  describe('mergeIn', () => {
    it('Merges with empty source state', () => {
      result = immutableMgr.mergeIn({}, [defaultProp1], origState.defaultProp1);
      expect(result).to.deep.equal({ defaultProp1: { nestedProp1 } });
    });

    it('Does not mutate original state', () => {
      result = immutableMgr.mergeIn(state, [defaultProp1], { addProp4 });
      expect(state).to.deep.equal(origState);
    });

    it('Merges at desired location', () => {
      result = immutableMgr.mergeIn(state, [defaultProp1], { addProp4 });
      expect(result).to.deep.equal({
        defaultProp1: { nestedProp1, addProp4 },
        defaultProp2,
        defaultProp3
      });
    });

    it('Creates and sets non-existent location', () => {
      result = immutableMgr.mergeIn(state, [addProp4], { nestedProp1 });
      expect(result).to.deep.equal({
        defaultProp1: {
          nestedProp1
        },
        defaultProp2,
        defaultProp3,
        addProp4: {
          nestedProp1
        }
      });
    });
  }); // mergeIn

  // push
  /////////////////

  describe('push', () => {
    beforeEach(() => {
      origState = {
        defaultProp1: {
          nestedProp1
        },
        defaultProp2,
        defaultProp3 : defaultArray
      };
      state = cloneDeep(origState);
    });
    it('Push onto an empty source state, creating the array', () => {
      result = immutableMgr.push({}, addProp4, [addProp4]);
      expect(result.addProp4.length).to.equal(1);
      expect(result.addProp4[0]).to.equal(addProp4);
    });

    it('Does not mutate original state', () => {
      result = immutableMgr.push(state, defaultProp3, [addProp4]);
      expect(state).to.deep.equal(origState);
    });

    it('Pushes new element to end of array', () => {
      result = immutableMgr.push(state, defaultProp3, [addProp4]);
      expect(state).to.deep.equal(origState);
      expect(result).to.deep.equal({
        defaultProp1: { nestedProp1 },
        defaultProp2,
        defaultProp3: [defaultArrayItem, addProp4]
      });
    });
    // TODO: is this the behavior we want?
    it('does not overwrite an existing non-array prop, leaving unmutated', () => {
      result = immutableMgr.push(state, defaultProp1, [addProp4]);
      expect(state).to.deep.equal(result);
    });
  }); // push


  // pushIn
  /////////////////

  describe('pushIn', () => {
    beforeEach(() => {
      origState = {
        defaultProp1: {
          nestedProp1: ['nestedProp1']
        },
        defaultProp2,
        defaultProp3
      };
      state = cloneDeep(origState);
    });
    it('Push onto an empty source state, creating the array', () => {
      result = immutableMgr.pushIn({}, [defaultProp1, nestedProp1], [addProp4]);
      expect(result.defaultProp1.nestedProp1.length).to.equal(1);
      expect(result.defaultProp1.nestedProp1[0]).to.equal(addProp4);
    });

    it('Does not mutate original state', () => {
      result = immutableMgr.pushIn(state, [defaultProp1, nestedProp1], [addProp4]);
      expect(state).to.deep.equal(origState);
    });

    it('Merges at desired location', () => {
      result = immutableMgr.pushIn(state, [defaultProp1, nestedProp1], [addProp4]);
      expect(result.defaultProp1.nestedProp1.length).to.equal(2);
      expect(result.defaultProp1.nestedProp1[1]).to.equal(addProp4);
    });
  }); // pushIn

  // unshift
  /////////////////

  describe('unshift', () => {
    beforeEach(() => {
      origState = {
        defaultProp1: {
          nestedProp1
        },
        defaultProp2,
        defaultProp3 : defaultArray
      };
      state = cloneDeep(origState);
    });

    it('unshift onto the front of an empty source state, creating the array', () => {
      result = immutableMgr.unshift({}, addProp4, [addProp4]);
      expect(result.addProp4.length).to.equal(1);
      expect(result.addProp4[0]).to.equal(addProp4);
    });

    it('Does not mutate original state', () => {
      result = immutableMgr.unshift(state, defaultProp3, [addProp4]);
      expect(state).to.deep.equal(origState);
    });

    it('Unshifts new item to beginning of array', () => {
      result = immutableMgr.unshift(state, defaultProp3, [addProp4]);
      expect(result).to.deep.equal({
        defaultProp1: { nestedProp1 },
        defaultProp2,
        defaultProp3: [addProp4, defaultArrayItem]
      });
    });
    // TODO: is this the behavior we want?
    it('does not overwrite an existing non-array prop, leaving unmutated', () => {
      result = immutableMgr.unshift(state, defaultProp1, [addProp4]);
      expect(state).to.deep.equal(result);
    });

  }); // unshift


  // unshiftIn
  /////////////////

  describe('unshiftIn', () => {
    beforeEach(() => {
      origState = {
        defaultProp1: {
          nestedProp1: [nestedProp1]
        },
        defaultProp2,
        defaultProp3
      };
      state = cloneDeep(origState);
    });
    it('Push onto an empty source state, creating the array', () => {
      result = immutableMgr.unshiftIn({}, [defaultProp1, nestedProp1], [addProp4]);
      expect(result.defaultProp1.nestedProp1.length).to.equal(1);
      expect(result.defaultProp1.nestedProp1[0]).to.equal(addProp4);
    });

    it('Does not mutate original state', () => {
      result = immutableMgr.unshiftIn(state, [defaultProp1, nestedProp1], [addProp4]);
      expect(state).to.deep.equal(origState);
    });

    it('Merges at desired location', () => {
      result = immutableMgr.unshiftIn(state, [defaultProp1, nestedProp1], [addProp4]);
      expect(result.defaultProp1.nestedProp1.length).to.equal(2);
      expect(result.defaultProp1.nestedProp1[0]).to.equal(addProp4);
    });
  }); // pushIn


  // pullAtIn
  /////////////////

  describe('pullAtIn', () => {
    beforeEach(() => {
      origState = {
        defaultProp1: {
          nestedProp1: ['nestedProp1', 'nestedProp2', 'nestedProp3']
        },
        defaultProp2,
        defaultProp3
      };
      state = cloneDeep(origState);
    });
    it('pull from an empty source state, returning the original state', () => {
      result = immutableMgr.pullAtIn(emptyState, [defaultProp1, nestedProp1], 1);
      expect(result).to.equal(emptyState);
    });

    it('Does not mutate original state', () => {
      result = immutableMgr.pullAtIn(state, [defaultProp1, nestedProp1], 1);
      expect(state).to.deep.equal(origState);
    });

    it('Pulls index from desired location', () => {
      result = immutableMgr.pullAtIn(state, [defaultProp1, nestedProp1], 1);
      expect(result.defaultProp1.nestedProp1.length).to.equal(2);
      expect(result.defaultProp1.nestedProp1[0]).to
        .equal(origState.defaultProp1.nestedProp1[0]);
      expect(result.defaultProp1.nestedProp1[1]).to
        .equal(origState.defaultProp1.nestedProp1[2]);
    });
    it('pull invalid index, returning the original state', () => {
      result = immutableMgr.pullAtIn(state, [defaultProp1, nestedProp1], 10);
      expect(result).to.equal(state);
    });
  }); // pullAtIn


  // remove
  /////////////////

  describe('remove', () => {
    beforeEach(() => {
      origState = {
        defaultProp1: {
          nestedProp1: ['nestedProp1', 'nestedProp2', 'nestedProp3']
        },
        defaultProp2,
        defaultProp3
      };
      state = cloneDeep(origState);
    });
    it('remove from an empty source state, returning the original state', () => {
      result = immutableMgr.remove(emptyState, defaultProp1);
      expect(result).to.equal(emptyState);
    });

    it('Does not mutate original state', () => {
      result = immutableMgr.remove(state, defaultProp1);
      expect(state).to.deep.equal(origState);
    });

    it('Removes loc', () => {
      result = immutableMgr.remove(state, defaultProp1);
      expect(result).to.deep.equal({
        defaultProp2,
        defaultProp3
      });
    });
  }); // remove


  // removeIn
  /////////////////

  describe('removeIn', () => {
    beforeEach(() => {
      origState = {
        defaultProp1: {
          nestedProp1: ['nestedProp1', 'nestedProp2', 'nestedProp3']
        },
        defaultProp2,
        defaultProp3
      };
      state = cloneDeep(origState);
    });
    it('remove from an empty source state, returning the original state', () => {
      result = immutableMgr.removeIn(emptyState, [defaultProp1, nestedProp1]);
      expect(result).to.equal(emptyState);
    });

    it('Does not mutate original state', () => {
      result = immutableMgr.removeIn(state, [defaultProp1, nestedProp1]);
      expect(state).to.deep.equal(origState);
    });

    it('Removes locArray', () => {
      result = immutableMgr.removeIn(state, [defaultProp1, nestedProp1]);
      expect(result).to.deep.equal({
        defaultProp1: {
        },
        defaultProp2,
        defaultProp3
      });
    });

  }); // removeIn
}); // immutableMgr
