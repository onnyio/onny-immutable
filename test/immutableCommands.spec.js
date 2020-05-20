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

/* eslint-disable import/no-extraneous-dependencies */

import { expect } from 'chai';
import immutableCommands from '../dist/immutableCommands';
// import immutableCommands from '../src/immutableCommands';


let result;
let value;
describe('immutableCommands', () => {
  beforeEach(() => {
    value = 1;
  });

  it('set', () => {
    result = immutableCommands.set(value);
    expect(result).to.deep.equal({ $set: value });
  });

  it('merge', () => {
    result = immutableCommands.merge(value);
    expect(result).to.deep.equal({ $merge: value });
  });

  it('push', () => {
    result = immutableCommands.push(value);
    expect(result).to.deep.equal({ $push: value });
  });

  it('unshift', () => {
    result = immutableCommands.unshift(value);
    expect(result).to.deep.equal({ $unshift: value });
  });

  it('apply', () => {
    result = immutableCommands.apply(value);
    expect(result).to.deep.equal({ $apply: value });
  });

  it('splice', () => {
    result = immutableCommands.splice(value);
    expect(result).to.deep.equal({ $splice: value });
  });
}); // immutableCommands
