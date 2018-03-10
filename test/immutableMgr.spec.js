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
let result2;
let origState;
let state;
let loc;

describe('immutableMgr', () => {
  beforeEach(() => {
    result = null;
    origState = {
      defaultProp1: { nestedProp1 },
      defaultProp2,
      defaultProp3,
      defaultArray
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

    it('Returns un-mutated prop', () => {
      result = immutableMgr.get(state, 'defaultArray');
      expect(result).to.equal(state['defaultArray']);
    });

    it('Returns correct prop twice', () => {
      result = immutableMgr.get(state, defaultProp3);
      result2 = immutableMgr.get(state, defaultProp3);
      expect(result).to.equal(result2);
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
      expect(result).to.deep.equal(undefined);
    });

    it('invalid location', () => {
      result = immutableMgr.getIn(state, [null]);
      expect(result).to.deep.equal(undefined);
    });

    it('has non-array location', () => {
      result = immutableMgr.getIn(state, defaultProp3);
      expect(result).to.deep.equal(undefined);
    });

    it('incorrect location', () => {
      result = immutableMgr.getIn(state, [defaultProp1, defaultProp2]);
      expect(result).to.deep.equal(undefined);
    });

    it('Returns correct prop', () => {
      result = immutableMgr.getIn(state, loc);
      expect(result).to.equal(nestedProp1);
    });

    it('Returns un-mutated prop', () => {
      result = immutableMgr.getIn(state, loc);
      expect(result).to.equal(state['defaultProp1']['nestedProp1']);
    });

    it('Returns correct prop twice', () => {
      result = immutableMgr.getIn(state, loc);
      result2 = immutableMgr.getIn(state, loc);
      expect(result).to.equal(result2);
    });
  }); // getIn

  // set
  /////////////////

  describe('set', () => {
    it('Has empty source state - Deep Equal', () => {
      result = immutableMgr.set({}, { defaultProp1 });
      expect(result).to.deep.equal({ defaultProp1 });
    });


    it('Complete replace with valid source state - Deep Equal', () => {
      result = immutableMgr.set(state, { defaultProp1 });
      expect(result).to.deep.equal({ defaultProp1 });
    });

    it('Does not mutate original state - Deep Equal', () => {
      // we already shown 'state' returns the exact same object using set if nothing changes
      // now verify that it still contains the original values with a deep equal
      result = immutableMgr.set(state, addProp4);
      expect(state).to.deep.equal(origState);
    });

    it('maintains original element, deleting others in valid source state', () => {
      result = immutableMgr.set(state, state.defaultProp1);
      expect(result).to.equal(state.defaultProp1);
    });

    it('replace with the exact same thing', () => {
      result = immutableMgr.set(state, state);
      expect(result).to.equal(state);
    });

    it('replace with the origState', () => {
      result = immutableMgr.set(state, origState);
      expect(result).to.deep.equal(state);
    });
  }); // set

  // setIn
  /////////////////

  describe('setIn', () => {

    beforeEach(() => {
      loc = ['defaultProp1', 'nestedProp1'];
    });

    it('Has empty source state', () => {
      result = immutableMgr.setIn({}, loc, defaultProp1);
      expect(result).to.deep.equal({
        defaultProp1: {
          nestedProp1: defaultProp1
        }
      });
    });

    it('invalid location returns state', () => {
      result = immutableMgr.setIn(state, null, defaultProp1);
      expect(result).to.deep.equal(state);
    });


    it('Does not mutate original state - Deep Equal', () => {
      result = immutableMgr.setIn(state, loc, addProp4);
      expect(result).to.not.deep.equal(state);
      expect(state).to.deep.equal(origState);
    });

    it('Creates and sets new location', () => {
      result = immutableMgr.setIn(state, ['defaultProp1', 'addProp4'], addProp4);
      expect(result).to.deep.equal({
        defaultProp1: {
          nestedProp1,
          addProp4
        },
        defaultProp2,
        defaultProp3,
        defaultArray
      });
    });

    it('New location does not mutate other elements', () => {
      result = immutableMgr.setIn(state, ['defaultProp1', 'addProp4'], addProp4);
      expect(result.defaultProp1.nestedProp1).to.equal(state.defaultProp1.nestedProp1);
      expect(result.defaultProp2).to.equal(state.defaultProp2);
      expect(result.defaultProp3).to.equal(state.defaultProp3);
      expect(result['defaultArray']).to.equal(state['defaultArray']);
    });

    it('Replaces existing location', () => {
      result = immutableMgr.setIn(state, loc, addProp4);
      expect(result).to.deep.equal({
        defaultProp1: { nestedProp1: addProp4 },
        defaultProp2,
        defaultProp3,
        defaultArray
      });
    });

    it('Replacing location does not mutate other elements', () => {
      result = immutableMgr.setIn(state, loc, addProp4);
      expect(result.defaultProp2).to.equal(state.defaultProp2);
      expect(result.defaultProp3).to.equal(state.defaultProp3);
      expect(result['defaultArray']).to.equal(state['defaultArray']);
    });
  }); // setIn

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
        defaultProp3,
        defaultArray
      });
    });

    it('does not mutate other elements', () => {
      result = immutableMgr.update(state, 'defaultProp1', updateFunc);
      expect(result.defaultProp2).to.equal(state.defaultProp2);
      expect(result.defaultProp3).to.equal(state.defaultProp3);
      expect(result['defaultArray']).to.equal(state['defaultArray']);
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
        defaultProp3,
        defaultArray
      });
    });

    it('does not mutate other elements', () => {
      result = immutableMgr.updateIn(state, [defaultProp1, nestedProp1], updateFunc);
      expect(result.defaultProp2).to.equal(state.defaultProp2);
      expect(result.defaultProp3).to.equal(state.defaultProp3);
      expect(result['defaultArray']).to.equal(state['defaultArray']);
    });

    it('Does not create non-existent location', () => {
      result = immutableMgr.updateIn(state, [defaultProp1, addProp4], updateFunc);
      expect(result).to.equal(state);
    });
  }); // updateIn

  // Merge
  /////////////////

  describe('merge', () => {
    it('Merges with undefined source state', () => {
      result = immutableMgr.merge(undefined, origState.defaultProp1);
      expect(result).to.deep.equal({ nestedProp1 });
    });

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
        defaultArray,
        addProp4
      });
    });


    it('Merges and creates location if it does not exist', () => {
      result = immutableMgr.merge(state, { addProp4 });
      expect(result).to.deep.equal({
        defaultProp1: { nestedProp1 },
        defaultProp2,
        defaultProp3,
        defaultArray,
        addProp4
      });
    });

    it('Merges and overwrites existing location', () => {
      result = immutableMgr.merge(state, { defaultProp3: addProp4 });
      expect(result).to.deep.equal({
        defaultProp1: { nestedProp1 },
        defaultProp2,
        defaultProp3: addProp4,
        defaultArray
      });
    });

    it('Does not mutate other elements', () => {
      result = immutableMgr.merge(state, { defaultProp3: addProp4 });
      expect(result.defaultProp1).to.equal(state.defaultProp1);
      expect(result.defaultProp2).to.equal(state.defaultProp2);
      expect(result['defaultArray']).to.equal(state['defaultArray']);
    });
  }); // merge


  // mergeIn
  /////////////////

  describe('mergeIn', () => {
    it('Merges with undefined source state', () => {
      result = immutableMgr.mergeIn(undefined, [defaultProp1], origState.defaultProp1);
      expect(result).to.deep.equal({ defaultProp1: { nestedProp1 } });
    });
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
        defaultProp3,
        defaultArray
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
        defaultArray,
        addProp4: {
          nestedProp1
        }
      });
    });

    it('Does not mutate other elements', () => {
      result = immutableMgr.mergeIn(state, [addProp4], { nestedProp1 });
      expect(result.defaultProp1).to.equal(state.defaultProp1);
      expect(result.defaultProp2).to.equal(state.defaultProp2);
      expect(result.defaultProp3).to.equal(state.defaultProp3);
      expect(result['defaultArray']).to.equal(state['defaultArray']);
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
        defaultProp3: defaultArray
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

    it('Does not mutate other elements', () => {
      result = immutableMgr.push(state, defaultProp3, [addProp4]);
      expect(result.defaultProp1).to.equal(state.defaultProp1);
      expect(result.defaultProp2).to.equal(state.defaultProp2);
      expect(result['defaultArray']).to.equal(state['defaultArray']);
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
        defaultProp3,
        defaultArray
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

    it('Does not mutate other elements', () => {
      result = immutableMgr.pushIn(state, [defaultProp1, nestedProp1], [addProp4]);
      expect(result.defaultProp2).to.equal(state.defaultProp2);
      expect(result.defaultProp3).to.equal(state.defaultProp3);
      expect(result['defaultArray']).to.equal(state['defaultArray']);
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
        defaultProp3: defaultArray
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

    it('Does not mutate other elements', () => {
      result = immutableMgr.unshift(state, defaultProp3, [addProp4]);
      expect(result.defaultProp1).to.equal(state.defaultProp1);
      expect(result.defaultProp2).to.equal(state.defaultProp2);
      expect(result['defaultArray']).to.equal(state['defaultArray']);
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
        defaultProp3,
        defaultArray
      };
      state = cloneDeep(origState);
    });
    it('Push onto an empty source state, creating the array', () => {
      result = immutableMgr.unshiftIn({}, [defaultProp1, nestedProp1], [addProp4]);
      expect(result.defaultProp1.nestedProp1.length).to.equal(1);
      expect(result.defaultProp1.nestedProp1[0]).to.equal(addProp4);
    });

    it('Does not mutate original state - Deep Equal', () => {
      result = immutableMgr.unshiftIn(state, [defaultProp1, nestedProp1], [addProp4]);
      expect(state).to.deep.equal(origState);
    });

    it('Merges at desired location', () => {
      result = immutableMgr.unshiftIn(state, [defaultProp1, nestedProp1], [addProp4]);
      expect(result.defaultProp1.nestedProp1.length).to.equal(2);
      expect(result.defaultProp1.nestedProp1[0]).to.equal(addProp4);
    });

    it('Does not mutate other elements', () => {
      result = immutableMgr.unshiftIn(state, [defaultProp1, nestedProp1], [addProp4]);
      expect(result.defaultProp2).to.equal(state.defaultProp2);
      expect(result.defaultProp3).to.equal(state.defaultProp3);
      expect(result['defaultArray']).to.equal(state['defaultArray']);
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
        defaultProp3,
        defaultArray
      };
      state = cloneDeep(origState);
    });
    it('pull from an empty source state, returning the original state', () => {
      result = immutableMgr.pullAtIn(emptyState, [defaultProp1, nestedProp1], 1);
      expect(result).to.equal(emptyState);
    });

    it('Does not mutate original state - Deep Equal', () => {
      result = immutableMgr.pullAtIn(state, [defaultProp1, nestedProp1], 1);
      expect(state).to.deep.equal(origState);
    });
    it('pull invalid index, returning the original state', () => {
      result = immutableMgr.pullAtIn(state, [defaultProp1, nestedProp1], 10);
      expect(result).to.equal(state);
    });

    it('Pulls index from desired location', () => {
      result = immutableMgr.pullAtIn(state, [defaultProp1, nestedProp1], 1);
      expect(result.defaultProp1.nestedProp1.length).to.equal(2);
      expect(result.defaultProp1.nestedProp1[0]).to.equal(origState.defaultProp1.nestedProp1[0]);
      expect(result.defaultProp1.nestedProp1[1]).to.equal(origState.defaultProp1.nestedProp1[2]);
    });

    it('Pulls index from desired location, leaves other untouched', () => {
      result = immutableMgr.pullAtIn(state, [defaultProp1, nestedProp1], 1);
      expect(result.defaultProp2).to.equal(state.defaultProp2);
      expect(result.defaultProp3).to.equal(state.defaultProp3);
      expect(result['defaultArray']).to.equal(state['defaultArray']);
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

    it('Removes loc - Deep Equal', () => {
      result = immutableMgr.remove(state, defaultProp1);
      expect(result).to.deep.equal({
        defaultProp2,
        defaultProp3
      });
    });

    it('Does not mutate other elements - Deep Equal', () => {
      result = immutableMgr.remove(state, defaultProp1);
      expect(result['defaultProp2']).to.equal(state['defaultProp2']);
      expect(result['defaultProp3']).to.equal(state['defaultProp3']);
    });
  }); // remove


  // removeIn
  /////////////////

  describe('removeIn/deleteIn', () => {
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
      expect(result).to.deep.equal({});
    });

    it('Does not mutate original state - Deep Equal', () => {
      result = immutableMgr.removeIn(state, [defaultProp1, nestedProp1]);
      expect(state).to.deep.equal(origState);
    });

    it('Removes locArray', () => {
      result = immutableMgr.removeIn(state, [defaultProp1, nestedProp1]);
      expect(result).to.deep.equal({
        defaultProp1: {},
        defaultProp2,
        defaultProp3
      });
    });

    it('Does not mutate other elements - Deep Equal', () => {
      result = immutableMgr.removeIn(state, [defaultProp1, nestedProp1]);
      expect(result['defaultProp1']).to.deep.equal({});
      expect(result['defaultProp2']).to.equal(state['defaultProp2']);
      expect(result['defaultProp3']).to.equal(state['defaultProp3']);
    });

  }); // removeIn/deleteIn

  describe('withMutations', () => {
    beforeEach(() => {
      origState = {
        defaultProp1: {
          nestedProp1: ['nestedProp1', 'nestedProp2', 'nestedProp3']
        },
        defaultProp2,
        defaultProp3,
        request: {
          home: {
            loading: 2,
            loadingError: [],
            loadingFailure: []
          }
        }
      };
      state = cloneDeep(origState);
    });

    it('clear', () => {
      result = immutableMgr.withMutations(emptyState, (mutations => {
        return mutations
          .clear();

      }));
      expect(result).to.equal(emptyState);
      expect(result).to.deep.equal({});
    });

    it('remove from an empty source state, returning the original state', () => {
      result = immutableMgr.withMutations(emptyState, (mutations => {
        return mutations
          .deleteIn([defaultProp1, nestedProp1]);

      }));
      expect(result).to.equal(emptyState);
      expect(result).to.deep.equal({});
    });

    it("remove nested item that doesn't exist returns state", () => {
      const testState = {
        defaultProp1: {
          nestedProp1: ['nestedProp1', 'nestedProp2', 'nestedProp3']
        },
        defaultProp2,
        defaultProp3,
        request: {
          home: {
            loading: 2,
            loadingError: [],
            loadingFailure: []
          }
        }
      };

      const id = 'home';
      result = immutableMgr.withMutations(testState, (mutations => {
        const result = mutations
          .deleteIn([id, 'loadingError'])
          .deleteIn([id, 'loadingFailure']);
        return result;
      }));
      expect(result).to.equal(testState);
    });
  });
}); // immutableMgr
